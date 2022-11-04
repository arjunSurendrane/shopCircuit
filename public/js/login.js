const loginForm = document.querySelector('.form')
const logoutForm = document.querySelector('.nav__logout1')
const signUpForm = document.querySelector('.form-signup')


// const login = async (email, password) => {
//     try {
//         const res = await axios({
//             method: 'POST',
//             url: '/login',
//             data: {
//                 email,
//                 password
//             }
//         })
//         if (res.data.status == 'success') {
//             window.setTimeout(() => {
//                 location.assign('/')
//             }, 500)
//         }
//     } catch (err) {
//         alert(err.response.data.message)
//     }
// }


// const logout = async () => {
//     const res = await axios({
//         method: 'GET',
//         url: 'logout'

//     })
//     if (res.data.status == 'success') {
//         location.reload(true);
//     }
// }


if (loginForm) {
    loginForm.addEventListener('submit', async el => {
        el.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const res = await axios({
                method: 'POST',
                url: '/login',
                data: {
                    email,
                    password
                }
            })
            if (res.data.status == 'success') {
                window.setTimeout(() => {
                    location.assign('/')
                }, 500)
            }
        } catch (err) {
            alert(err)
        }

    })
}


if (logoutForm) {
    logoutForm.addEventListener('click', async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: '/logout'

            })
            console.log('inside logout')
            if (res.data.status == 'success') {
                location.reload(true);
            }
        } catch (err) {
            console.log('error, try again!!!')
        }
    })
}

if (signUpForm) {
    signUpForm.addEventListener('submit', async el => {
        el.preventDefault();
        try {
            console.log(document.getElementById('email').value)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const mob = document.getElementById('mob').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            // const Pincode = document.getElementById('Pincode').value;
            // const city = document.getElementById('city').value;
            // const Locality = document.getElementById('Locality').value;
            // const BuildingName = document.getElementById('BuildingName_signup').value;
            // const Landmark = document.getElementById('Landmark_signup').value;
            // const AddressType = document.getElementById('AddressType').value;

            console.log(name, email, mob, password, confirmPassword)


            const res = await axios({
                method: 'POST',
                url: '/signup',
                data: {
                    name,
                    email,
                    mob,
                    password,
                    confirmPassword

                }
            })
            if (res.data.status == 'success') {
                window.setTimeout(() => {
                    location.assign('/')
                }, 500)
            }

        } catch (err) {
            console.log(err)
            alert(err.response.data.message)
        }

    })
}