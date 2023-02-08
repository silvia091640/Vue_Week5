// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// import pagination from './pagination.js';
const { localize, loadLocaleFromURL } = VeeValidateI18n;

const { createApp } = Vue;

const apiUrl="https://vue3-course-api.hexschool.io/v2";

const path="silvia-hexschool";


Object.keys(VeeValidateRules).forEach((rule) => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
  
  loadLocaleFromURL(
    'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
  );
  
  VeeValidate.configure({
    generateMessage: localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });
  


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
            },
            form:{
                user:{
                name: '',
                email: '',
                tel: '',
                address: '',
                },
                message: '',
            },
            isLoading: false,
        }
    },
    methods: {
        getAllProducts(){
            axios.get(`${apiUrl}/api/${path}/admin/products/all`)
            .then((res)=>{
                this.products=res.data.products;
            })
            .catch(error=>{            
                console.log(error);
            })

        },
        getCarts(){
            axios.get(`${apiUrl}/api/${path}/cart`)
            .then((res)=>{
                this.carts=res.data.data.carts;
                console.log(res.data.data);
            })
            .catch(error=>{       
                console.log(error);
            })
        },
        addCart(productId,qty=1) {
            this.cartData.product_id=productId;
            this.cartData.qty=qty;
            axios.post(`${apiUrl}/api/${path}/cart`,{ data:this.cartData })
            .then((res)=>{
                
                // console.log(res);
                this.getCarts();
            })
            .catch(error=>{
            
                console.log(error);
            })
        },
        updateCart(item){
            console.log(item)
            this.cartData.product_id=item.id;
            this.cartData.qty=item.qty;
            axios.put(`${apiUrl}/api/${path}/cart/${item.id}`,{ data:this.cartData })
            .then((res)=>{
                this.getCarts();
                alert(res.data.message);
            })
            .catch(error=>{
            
                console.log(error);
            })

        },
        removeCartItem(cartId){
            axios.delete(`${apiUrl}/api/${path}/cart/${cartId}`)
            .then((res)=>{
                this.getCarts();
                console.log(res);
                alert(res.data.message);
            })
            .catch(error=>{
            
                console.log(error);
            })

        },
        removeAllCarts(){
            axios.delete(`${apiUrl}/api/${path}/carts`)
            .then((res)=>{
                this.getCarts();
                alert(res.data.message);

            })
            .catch(error=>{
            
                console.log(error);
            })

        },
        createOrder(){
            console.log(this.form)
            axios.post(`${apiUrl}/api/${path}/order`,{ data :this.form })
            .then((res)=>{
                alert(res.data.message);
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
       
       
    },
    mounted() {
      const token= document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      axios.defaults.headers.common.Authorization = token;

      this.getAllProducts();   
      this.getCarts(); 
      this.productModal=new bootstrap.Modal(this.$refs.productModal);
    //   this.isLoading = true;
    //   this.createProduct();
    },
})

// 元件註冊
app.component("loading", VueLoading.Component);

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.component("product-modal", {
   props: ["product"],
    template: "#product-modal-template",
  });
app.mount("#app");


