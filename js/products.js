import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// import pagination from './pagination.js';

const apiUrl="https://vue3-course-api.hexschool.io/v2";

const path="silvia-hexschool";


let productModal = '';
// let delProductModal='';


const app=createApp({
    data() {
        return {          
            product:{},
            products:[],
            productModal:{},
            // isNew: false,
            // page:{}
        }
    },
    methods: {
        getAllProducts(){
            axios.get(`${apiUrl}/api/${path}/admin/products/all`)
            .then((res)=>{
                this.products=res.data.products;
                console.log(res.data.products);
            })
            .catch(error=>{
            
                console.log(error);
            })

        },
        saveProduct(){
            if(this.isNew)
            {
                axios.post(`${apiUrl}/api/${path}/admin/product`,{data :this.tempProduct })
                .then((res)=>{
                    productModal.hide();
                    this.getAllProducts();
                    
                })
                .catch(error=>{
                
                    console.log(error);
                })
            }
            else{
             axios.put(`${apiUrl}/api/${path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
            .then((res)=>{
                productModal.hide();
                this.getAllProducts();
                
            })
            .catch(error=>{
            
                console.log(error);
            })
            }
           
        },
        checkAdmin(){
          axios.post(`${apiUrl}/api/user/check`)
          .then(res=>{            
                this.getAllProducts();                         
          })
          .catch(error=>{
            window.location ="login.html";
          })
        },
        openModal(item){   
            this.product={...item};   
            this.productModal.show();
            
        }
       
    },
    mounted() {
      const token= document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      axios.defaults.headers.common.Authorization = token;

      this.checkAdmin();
    //   this.getAllProducts();   
      this.productModal=new bootstrap.Modal(this.$refs.productModal);
    //   this.createProduct();
    },
})


app.component("product-modal", {
   props: ["product"],
    template: "#product-modal-template",
  });
app.mount("#app");


