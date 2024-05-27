function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
// Получить csrftoken из Cookie
//const csrftoken = getCookie('csrftoken')

cartnum = document.querySelector('.cart__num')
shopping_cart = document.querySelector('.shopping-cart')
btns = document.querySelectorAll('.del-b')
let item = document.querySelectorAll('.item')

let title2 = document.querySelector(".title2")
let get_total_price = document.querySelector(".get-total-price")
let modal_content = document.querySelector('.modal-content');
let cart_chetchik = document.querySelector('.cart');

plus_btn = document.querySelectorAll('.plus-btn')
minus_btn = document.querySelectorAll('.minus-btn')

function getQuantity()
{
    $.ajax({
        url: '/cart/cart_get_totalitems/',
        type: 'get',
        dataType: 'json',
        success: function(response) {
            // Если данные успешно получены, то создаем карточки для каждого поста
            // console.log(response)
            // Посмотреть ключи обьекта console.log(Object.keys(response))

            // Посмотреть Значения  обьекта console.log(Object.values(response));
            znacheniyaobecta = Object.values(response)

            kolvopribreaemogotovara = znacheniyaobecta[0]
            itogovayasummatovarov = znacheniyaobecta[1]

            if (kolvopribreaemogotovara > 0) {
                //console.log('kolvopribretaemogotovara > 0');
                get_total_price.textContent = "Итоговая цена за " + kolvopribreaemogotovara + " шт.";
                const p = document.createElement("p");
                p.textContent = itogovayasummatovarov + " ₽";
                get_total_price.appendChild(p);
                cartnum.textContent = kolvopribreaemogotovara
            }
            else {
                //console.log('kolvopribretaemogotovara <= 0');
                // Удалить элементы
                modal_content.remove();title2.remove();get_total_price.remove();cart_chetchik.remove();
                // Добавить новые элементы
                const div = document.createElement("div");
                div.setAttribute("class", "title4");
                div.textContent = "Корзина пустая"
                shopping_cart.appendChild(div)
                const p = document.createElement("p");
                p.textContent = "Перейти к "
                p.setAttribute("class", "ptest");
                div.appendChild(p)
                const a = document.createElement("a");
                a.setAttribute("href", "/catalog/");
                a.textContent = "каталогу"
                p.appendChild(a)
            }

            $.each(response, function(sv) {
//                var card = sv
//                console.log(card)

//                $('#post-container').append(card);
            });
        },

        error: (error) => {
            console.log(error);
        },
    });
};

for(btn of btns) {
    btn.addEventListener('click',function delete_tovars(){
        let card = this.closest('.item')
        let dots = card.querySelector('.del-b')
        // console.log(dots)
        name_attr = dots.getAttribute("name");
        let name_attr2 = name_attr.replace(/[^0-9]/g,"")
        // console.log(typeof(name_attr2))
        //Остановить функцию - return
        // return console.log;
        // console.log(name_attr)
        let id_product = (JSON.parse(name_attr2))
        $.ajax({
            url: '/cart/remove/',
            type: "POST",
            dataType: "json",
            data:JSON.stringify({payload: id_product,}),
            headers: {
            "HTTP_X_REQUESTED_WITH": "XMLHttpRequest",
            'X-CSRFToken': getCookie('csrftoken'),
            },
            success: (data) => {
                //console.log(data);
                // Удалить карточку товара
                card.remove();
                // Вызвать функцию getPosts()
                getQuantity();
            },
            error: (error) => {
                console.log(error);
            }
        });
    });
};

for(btn of plus_btn) {
    btn.addEventListener('click',function changeQuality(){
        let card = this.closest('.item')
        let dots = card.querySelector('.del-b')
        let kolvo_tovar= card.querySelector('.total-price')
        let total_price_tovar = card.querySelector('.total-price2')

        //console.log(dots)
        name_attr = dots.getAttribute("name");
        let name_attr2 = name_attr.replace(/[^0-9]/g,"")
        //console.log(name_attr2)
        //Остановить функцию - return
        // return console.log;
        let id_product = (JSON.parse(name_attr2))
        //console.log(id_product)

            $.ajax({
                url: '/cart/changeQualityProduct/',
                type: "POST",
                dataType: "json",
                data:JSON.stringify({meaning: id_product, operation: 'Plus'}),
                headers: {
                "HTTP_X_REQUESTED_WITH": "XMLHttpRequest",
                'X-CSRFToken': getCookie('csrftoken'),
                },
                success: (data) => {
                    //console.log(data);
                    //console.log('Успешная передача');

                    statustovara = data.status;

                     if (statustovara == 'Success delete tovar'){
                        card.remove();
                        // Вызвать функцию getPosts();
                        getQuantity();
                    }
                    else{
                        quantitystatus = data.quantitystatus;
                        totalprice = data.totalprice;
                        kolvo_tovar.textContent = quantitystatus
                        total_price_tovar.textContent = totalprice + " ₽"
                        // Вызвать функцию getPosts()
                        getQuantity();
                    }

                    // console.log(quantitystatus, 'Статус передачи')
                    //totalprice = data.totalprice

                },
                error: (error) => {
                    console.log(error);
                }
            });
    });
};

for(btn of minus_btn) {
    btn.addEventListener('click',function changeQuality(){
        let card = this.closest('.item')
        let dots = card.querySelector('.del-b')
        let kolvo_tovar= card.querySelector('.total-price')
        let total_price_tovar = card.querySelector('.total-price2')
        name_attr = dots.getAttribute("name");
        let name_attr2 = name_attr.replace(/[^0-9]/g,"")
        //console.log(name_attr2)
        //Остановить функцию - return
        // return console.log;
        let id_product = (JSON.parse(name_attr2))
        //console.log(id_product)

            $.ajax({
                url: '/cart/changeQualityProduct/',
                type: "POST",
                dataType: "json",
                data:JSON.stringify({meaning: id_product, operation: 'Minus'}),
                headers: {
                "HTTP_X_REQUESTED_WITH": "XMLHttpRequest",
                'X-CSRFToken': getCookie('csrftoken'),
                },
                success: (data) => {
                    //console.log(data);
                    //console.log('Успешная передача', data.status);
                    statustovara = data.status;
                    //console.log(statustovara);
                    if (statustovara == 'Success delete tovar'){
                        card.remove();
                        // Вызвать функцию getPosts();
                        getQuantity();
                    }
                    else{
                        quantitystatus = data.quantitystatus;
                        totalprice = data.totalprice;

                        kolvo_tovar.textContent = quantitystatus;
                        total_price_tovar.textContent = totalprice + " ₽";
                        getQuantity();
                    }

                },
                error: (error) => {
                    console.log(error);
                }
            });
    });
};