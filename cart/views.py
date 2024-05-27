import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseForbidden, HttpResponseBadRequest, HttpResponseRedirect
from shop.models import Product
from .cart import Cart

# Функция для POST Запросов  - должно соответствовать ('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

# get Запрос со страницы
def cart_get_totalitems(request):
    cart = Cart(request)

    if is_ajax(request=request):
        kolvotovarov = []
        summatovarov = []
        for item in cart:
            kolvo = item['quantity']
            # print('Кол-во приобретаемого товара', kolvo)
            total_item = item['price'] * item['quantity']
            # print('Итоговая сумма товара', total_item)
            kolvotovarov.append(int(kolvo))
            summatovarov.append(int(total_item))

        # print(kolvopribreaemogotovara)
        kolvopribreaemogotovara = sum(kolvotovarov)
        itogovayasummatovarov = sum(summatovarov)
        # print(sum(kolvopribreaemogotovara), 'Количество товаров в корзине')
        # print(sum(itogovayasummatovarov), 'Итоговая сумма товаров в корзине')
        return JsonResponse(
            {
                'kolvopribreaemogotovara': kolvopribreaemogotovara,
                'itogovayasummatovarov': itogovayasummatovarov,
            }
        )
    else:
        return HttpResponse(status=500)


def cart_remove2(request):
    cart = Cart(request)
    global id_tovar

    if is_ajax(request=request):
        # print(request)
        data = json.load(request)
        id_tovar = data.get('payload')

        data = int(id_tovar)
        product = get_object_or_404(Product, id=data)
        cart.remove(product)
        return JsonResponse({'status': data})
    else:
        return HttpResponse(status=500)


def changeQualityProduct(request):
    if is_ajax(request=request):
        # print(request)
        str(request)
        data = json.load(request)
        meaning = data.get('meaning')
        # print('ID - ', meaning)
        id_product = str(meaning)
        operation = data.get('operation')
        # print('Операция - ', operation)

        cart = request.session['cart']
        # print(cart)
        # cart.update(quantity=15)
        id_product2 = (cart.get(id_product))
        if id_product2 == None:
            status = 'Success delete tovar'
            quantitystatus = 0
            totalprice = 0

            cart2 = Cart(request)
            product = get_object_or_404(Product, id=id_product)
            cart2.remove(product)
            return JsonResponse({'status': status,
                                 'quantitystatus': quantitystatus,
                                 'totalprice': totalprice
                                 })

        quantityproduct = (id_product2.get('quantity'))
        # print(quantityproduct, 'Получить количество товара')

        if 20 > quantityproduct > 0 and operation == "Plus":
            # print('нужно увеличить товар на один')
            id_product2.update(quantity=quantityproduct + 1)
            request.session.modified = True
            status = 'Success +1'
            quantitystatus = (id_product2.get('quantity'))
            totalprice = (int(id_product2.get('price'))) * (int(id_product2.get('quantity')))
            return JsonResponse({'status': status,
                                 'quantitystatus': quantitystatus,
                                 'totalprice': totalprice
                                 })

        elif quantityproduct == 20 and operation == "Plus":
            return HttpResponse(status=500)


        else:
            return HttpResponse(status=500)