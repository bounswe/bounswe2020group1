package com.example.tursuapp.authentication.homepage.ui.product

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageModel

class ProductAddFragment: Fragment() {

    private lateinit var productaddViewModel: ProductPageModel
    private lateinit var product: ProductDetailsResponse
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        productaddViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productadd, container, false)

        return root
    }
}

