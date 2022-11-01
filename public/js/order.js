const addtocart = document.getElementById('addToCart')


//  ===========1) ITEM ADDED TO CART IN PRODUCT DETAIL PAGE ==============
if (addtocart) {
    addtocart.addEventListener('submit', async el => {
        el.preventDefault();
        try {
            const quantity = 1;
            const url = window.location.toString();
            const id = url.split('/')[4]
            const res = await axios({
                method: 'post',
                url: `/cart/${id}`,
                data: {
                    quantity
                }
            })
            if (res.data.status == 'success') {
                Toastify({
                    text: "Item added to cart",
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            } else if (res.data.status == "duplicate") {
                Toastify({
                    text: "Item already in cart",
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #FFA400, #FFA500)",
                    }
                }).showToast();
            }
        } catch (err) {
            console.log(err)
            alert(err.response.data.message)
        }
    })
}


