<template>
    <div>
      <div :class="['fixed z-10 inset-0 overflow-y-auto ']" aria-labelledby="modal-title"
           aria-modal="true" role="dialog" >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
          <div aria-hidden="true" class="fixed inset-0 bg-gray-200 bg-opacity-75 transition-opacity"></div>

          <span aria-hidden="true" class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div
              :class="['inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all',size]">
            <div class="bg-white sm:pb-4 flex flex-col justify-between text-havelock-blue ">
              <div class="flex flex-row justify-between text-center border-b border-gray-200 py-3.5 px-3">
                <div class="flex flex-row">
                  <div class="flex flex-col justify-center"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path></svg> </div>
                  <div class="flex flex-col justify-center"><p class="px-2 ">Update {{object_title}} </p></div>
                </div>
                <div class="flex flex-col justify-center hover:bg-havelock-blue-100  rounded-full  w-7 h-7">
                  <div class="flex flex-row justify-center">
                    <svg @click="back" class="w-5 h-5 hover:w-4 hover:h-4 hover:cursor-pointer text-center" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-start px-3 py-3">
                <div class="flex justify-center">
                  <loading v-if="loading"></loading>
                </div>
                <FormulateForm v-if="jsonSchema" class="w-full" v-model="form" :errors="getErrorMessage" :schema="optionsPopulatedSchema" :form-errors="formErrors" invalid-message="Not all fields were filled out properly">
                  <FormulateErrors class="rounded-sm text-xs px-4 py-3 text-red-700 bg-red-100 border border-red-300" />

                </FormulateForm>
                <slot v-else></slot>
              </div>
              <div class="flex flex-row justify-between w-full border-t px-3 pt-3 font-semibold text-white">
                <button class="btn btn-red flex flex-col justify-center filter opacity-60"
                        type="button"
                        @click="back">
                  <div class="flex flex-row justify-between gap-x-2">
                    <p>Cancel</p> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </button>
                <button class="btn btn-green flex flex-col justify-center  "
                        type="button"
                        @click="executeAction">
                  <div class="flex flex-row justify-between gap-x-2">
                    <p>Save</p> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Loading from "@/components/utilities/loading";
import {mapGetters} from "vuex";

export default {
  name: "UpdateJsonItem",
  components: {Loading},
  data (){
    return {
      form: {},
      inputErrors:{},
      formErrors: [],
      modal_hidden: true,
      loading: false,
      fetchedOptions:[],
      optionsPopulatedSchema: [],
      fetchedData:{}
    }
  },
  props: {
    vuex_fetch_action: {
      type: String,
      default:null
    },
    vuex_fetch_key: {
      type: String,
      default:null
    },
    vuex_action: {
      type: String,
    },
    vuex_payload: {},
    object_title: {
      type: String,
      default: ''
    },
    object_id: {
      type: Number,
      default: null
    },
    http_verb: {
      type: String,
      default: ''
    },
    jsonSchema: {
      type: Array, default: () => {
        return []
      }
    },
    size: {
      type: String,
      default: "max-w-sm",
    },
    optionsList: {type: Array, default: () => []},
  },
  methods: {
    executeAction() {
      this.loading = true
      let existingPayload = this.fetchedData[`${this.vuex_fetch_key}`]?? []
      // we'll assume that this is an array of json objects
      existingPayload.splice(this.$route.params.itemIndex,1, this.form)
      console.log("mini payload", {id:this.object_id,data:existingPayload}, this.fetchedData)
      this.$store.dispatch(this.vuex_action, {id:this.object_id,data:existingPayload}).then(() => {
        this.$toast.success(
            `created ${this.object_title}  Successfully`
        )
        this.hidden = true;
        this.back()
        // eslint-disable-next-line no-unused-vars
      }).catch(err => {
        this.loading = false
        console.log(err)
      }).then(() => {
        this.loading = false
      });
    },
    back() {
      this.$router.back()
    },
    tryOptions(){
      if (this.optionsList.length>0){
        this.fetchOptions()
      }else{
        this.optionsPopulatedSchema = this.jsonSchema
      }

    },
    async fetchOptions() {
      this.optionsList.map((option,index)=>{
        this.$store.dispatch(option).then((resp)=>{
          this.fetchedOptions.push(resp)
        }).then(()=>{
          if(index +1 === this.optionsList.length){
            this.populateSchema()
          }
        })
      })

    },
    populateSchema(){
      let schema = JSON.stringify(this.jsonSchema)
      for(var index=0;index<this.fetchedOptions.length;index++){
        if(this.fetchedOptions[index].results) this.fetchedOptions[index] =this.fetchedOptions[index].results
      }
      this.fetchedOptions.map((option, index)=>{
        schema= schema.replace(`"options":[${index}]`, `"options":${JSON.stringify(option)}`)
      })
      this.optionsPopulatedSchema = JSON.parse(schema)
      this.loading = false
    },
  },
  computed: {
    ...mapGetters(['getErrorMessage'])
  },
  created(){
    this.tryOptions();
    if (this.vuex_fetch_action !== null){

      this.$store.dispatch(this.vuex_fetch_action, this.object_id).then(resp=>{
        this.fetchedData = resp
        // populate form
        let itemIndex = this.$route.params.itemIndex
        this.form = this.fetchedData[this.vuex_fetch_key][itemIndex]
      }).catch(err=>{
        this.$store.dispatch('setErrorMsg',err.response )
      })
    }
  },
}
</script>

<style scoped>

</style>