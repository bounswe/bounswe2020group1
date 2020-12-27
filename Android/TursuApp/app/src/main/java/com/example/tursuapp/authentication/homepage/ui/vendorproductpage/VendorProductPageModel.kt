package com.example.tursuapp.authentication.homepage.ui.vendorproductpage

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class VendorProductPageModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        //value = "This is home Fragment"
    }
    val text: LiveData<String> = _text
}