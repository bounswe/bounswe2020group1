package com.example.tursuapp.authentication.homepage.ui.shopping_cart

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ShoppingCartModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        //value = "This is home Fragment"
    }
    val text: LiveData<String> = _text
}