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
            carts:[],
            cartData:{
                product_id: "",
                qty: 1
            }
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
            
        },
        addCart(productId,qty=1) {
            this.cartData.product_id=productId;
            this.cartData.qty=qty;
            console.log(this.cartData)
            axios.post(`${apiUrl}/api/${path}/cart`,{ data:this.cartData })
            .then((res)=>{
                
                console.log(res);
            })
            .catch(error=>{
            
                console.log(error);
            })
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
   props: ["product","qty","addCart"],
    template: "#product-modal-template",
  });
app.mount("#app");


