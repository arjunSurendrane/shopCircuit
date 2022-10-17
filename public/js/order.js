const addtocart = document.getElementById('addToCart')


//  ===========1) ITEM ADDED TO CART IN PRODUCT DETAIL PAGE ==============
if (addtocart) {
    addtocart.addEventListener('submit', async el => {
        el.preventDefault();
        try {
            const quantity = document.getElementById('quantity').value;
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
                location.assign('/cart')
            }
        } catch (err) {
            alert(err.response.data.message)
        }
    })
}


