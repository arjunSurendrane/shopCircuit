const adminLogin = document.querySelector('.form_admin_login');
const adminLogout = document.querySelector('.admin__logout1')
const adminEditProduct = document.querySelector('.product_edit')
const adminAddProduct = document.querySelector('.productAdd')
const adminDeleteProduct = document.querySelector('.delete-product')
const adminEditCategory = document.querySelector('.category_admin_edit')
const adminAddCategory = document.querySelector('.category_admin_add')
const adminDeleteCategory = document.querySelector('.category-delete')
const adminBlockUser = document.querySelector('.user-Block')
const adminUnblockUser = document.querySelector('.user-Unblock')

const adminAddUser = document.querySelector('.form-signup-admin')



if (adminAddUser) {
    adminAddUser.addEventListener('submit', async el => {
        el.preventDefault();
        try {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const mob = document.getElementById('mob').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const Pincode = document.getElementById('Pincode').value;
            const city = document.getElementById('city').value;
            const Locality = document.getElementById('Locality').value;
            const BuildingName = document.getElementById('BuildingName_signup').value;
            const Landmark = document.getElementById('Landmark_signup').value;
            const AddressType = document.getElementById('AddressType').value;

            console.log(name, email, mob, password, confirmPassword, Pincode, city, Locality, BuildingName, Landmark, AddressType)


            const res = await axios({
                method: 'POST',
                url: '/admin/userAdd',
                data: {
                    name,
                    email,
                    mob,
                    password,
                    confirmPassword,
                    Pincode,
                    city,
                    Locality,
                    BuildingName,
                    Landmark,
                    AddressType

                }
            })
            if (res.data.status == 'success') {
                window.setTimeout(() => {
                    location.assign('/admin/user')
                }, 500)
            }

        } catch (err) {
            alert(err.response.data.message)
        }

    })
}








if (adminLogin) {
    adminLogin.addEventListener('submit', async el => {
        try {
            el.preventDefault();
            const email = document.getElementById('admin_email').value;
            const password = document.getElementById('admin_password').value;
            const res = await axios({
                method: 'POST',
                url: '/admin/login',
                data: {
                    email,
                    password
                }
            })
            console.log('submit')
            if (res.data.status == 'success') {
                window.setTimeout(() => {
                    location.assign('/admin/product')
                }, 500)
            }

        } catch (err) {
            alert(err)
        }
    })
}

if (adminLogout) {
    adminLogout.addEventListener('click', async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: '/logout'

            })
            console.log('inside logout')
            if (res.data.status == 'success') {
                location.assign('/admin');
            }
        } catch (err) {
            console.log('error, try again!!!')
        }
    })
}


if (adminAddProduct) {
    adminAddProduct.addEventListener('submit', async el => {
        el.preventDefault();
        try {
            // console.log(` photo is ${document.getElementById('photo').files[0]}`)
            const form = new FormData();
            form.append('productName', document.getElementById('productName').value)
            form.append('brand', document.getElementById('brand').value)
            form.append('varient', document.getElementById('varient').value)
            form.append('color', document.getElementById('color').value)
            form.append('price', document.getElementById('price').value)
            form.append('category', document.getElementById('category').value)
            form.append('quantity', document.getElementById('quantity').value)
            form.append('offer_name', document.getElementById('offer_name').value)
            form.append('discount', document.getElementById('discount').value)
            form.append('discription', document.getElementById('discription').value)
            form.append('image', document.getElementById('photo1').files[0])
            form.append('image', document.getElementById('photo2').files[0])
            form.append('image', document.getElementById('photo3').files[0])
            form.append('image', document.getElementById('photo4').files[0])

            
            console.log(form)

            // const productName = document.getElementById('productName').value;
            // const brand = document.getElementById('brand').value;
            // const varient = document.getElementById('varient').value;
            // const color = document.getElementById('color').value;
            // const price = document.getElementById('price').value;
            // const category = document.getElementById('category').value;
            // const quantity = document.getElementById('quantity').value;
            // const offer_name = document.getElementById('offer_name').value;
            // const discount = document.getElementById('discount').value;
            // const discription = document.getElementById('discription').value;
            console.log(form)
            const res = await axios({
                method: 'POST',
                url: '/admin/product',
                data: form
            })
            if (res.data.status == 'success') {
                location.assign('/admin/product')
            }

        } catch (err) {
            console.log(err)
            alert(err)
        }



    })
}


if (adminEditProduct) {
    adminEditProduct.addEventListener('submit', async el => {
        el.preventDefault();

        try {
            const url = window.location.href;
            console.log(url)
            // const form = new FormData();
            // form.append('productName', document.getElementById('productName').value)
            // form.append('brand', document.getElementById('brand').value)
            // form.append('varient', document.getElementById('varient').value)
            // form.append('color', document.getElementById('color').value)
            // form.append('price', document.getElementById('price').value)
            // form.append('category', document.getElementById('category').value)
            // form.append('quantity', document.getElementById('quantity').value)
            // form.append('offer_name', document.getElementById('offer_name').value)
            // form.append('discount', document.getElementById('discount').value)
            // form.append('discription', document.getElementById('discription').value)
            // form.append('image', document.getElementById('photo').files[0])

            const productName = document.getElementById('productName').value;
            const brand = document.getElementById('brand').value;
            const varient = document.getElementById('varient').value;
            const color = document.getElementById('color').value;
            const price = document.getElementById('price').value;
            const category = document.getElementById('category').placeholder;
            const quantity = document.getElementById('quantity').value;
            const offer_name = document.getElementById('offer_name').value;
            const discount = document.getElementById('discount').value;
            const discription = document.getElementById('discription').value;
            const res = await axios({
                method: 'PATCH',
                url,
                data: {
                    productName,
                    brand,
                    varient,
                    color,
                    price,
                    category,
                    quantity,
                    offer_name,
                    discount,
                    discription
                }
            })
            if (res.data.status == 'success') {

                location.assign('/admin/product')
                console.log(form);
            }

        } catch (err) {
            console.log(err)
            alert(err)
        }



    })
}



// if (adminDeleteProduct) {
//     adminDeleteProduct.addEventListener('click', async el => {
//         el.preventDefault()
//         const id = adminDeleteProduct.href
//         try {
//             const res = await axios({
//                 method: 'DELETE',
//                 url: id
//             })
//             if (res.data.status == 'success') {
//                 location.reload(true);
//             }
//         } catch (err) {
//             alert(err.response.data.message)
//         }
//     })
// }


if (adminEditCategory) {
    adminEditCategory.addEventListener('submit', async el => {
        el.preventDefault()
        try {
            const categoryName = document.getElementById('Category').value
            const url = window.location.href;
            const res = await axios({
                method: 'PATCH',
                url,
                data: {
                    categoryName

                }
            })

            if (res.data.content == 'success') {
                location.assign('/admin/category')
            }

        } catch (err) {
            alert('error')
            console.log(err)
        }
    })
}


if (adminAddCategory) {
    adminAddCategory.addEventListener('submit', async el => {
        el.preventDefault();
        const categoryName = document.getElementById('Category').value

        try {
            const res = await axios({
                method: 'POST',
                url: '/admin/category',
                data: {
                    categoryName
                }
            })

            if (res.data.status == 'success') {
                location.assign('/admin/category')
            }
        } catch (err) {
            alert(err.response.data.message)
        }
    })
}

// if (adminDeleteCategory) {
//     adminDeleteCategory.addEventListener('click', async el => {
//         el.preventDefault()
//         const id = document.getElementById('category-delete-url').href
//         console.log(id)
//         try {
//             const res = await axios({
//                 method: 'DELETE',
//                 url: id
//             })
//             if (res.data.status == 'success') {
//                 location.reload(true);
//             }
//         } catch (err) {
//             alert(err.response.data.message)
//         }
//     })
// }

if (adminBlockUser) {
    console.log('hekki')

    adminBlockUser.addEventListener('submit', async el => {
        console.log('hammo')
        try {
            el.preventDefault();
            const url = document.getElementById('user-block-url').href
            const res = await axios({
                method: 'PATCH',
                url,
                data: {
                    block: true

                }
            })
            if (res.data.status == 'success') {
                location.reload(true)
            }
        } catch (err) {
            console.log(err)
        }
    })

}

if (adminUnblockUser) {
    adminUnblockUser.addEventListener('submit', async el => {
        console.log('hammo')
        try {
            el.preventDefault();
            const url = document.getElementById('user-block-url').href
            const res = await axios({
                method: 'PATCH',
                url,
                data: {
                    block: false

                }
            })
            if (res.data.status == 'success') {
                location.reload(true)
            }
        } catch (err) {
            console.log(err)
        }
    })
}

