package com.example.tursuapp.authentication.homepage.ui.product

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.TokenResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProductAddFragment: Fragment() {

    private lateinit var productaddViewModel: ProductAddModel
    private lateinit var product: ProductDetailsResponse

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
       // productaddViewModel = ViewModelProvider(this).get(ProductAddModel::class.java)

        val root = inflater.inflate(R.layout.fragment_productadd,container,false)

        val btn = root.findViewById<View>(R.id.addProduct_button) as Button
        btn.setOnClickListener {
            val addProductName: EditText? = root.findViewById(R.id.editMobileNo)
            val addProductBrand: EditText? = root.findViewById(R.id.editMobileNo)
            val addProductStock: EditText? = root.findViewById(R.id.editMobileNo)
            val addProductPrice: EditText? = root.findViewById(R.id.editMobileNo)
            val addProductPhoto: EditText? = root.findViewById(R.id.editMobileNo)
            val addProductDescription: EditText? = root.findViewById(R.id.editMobileNo)

            if(addProductName!=null && addProductBrand!=null && addProductStock!=null && addProductPrice!=null && addProductPhoto!=null && addProductDescription!=null) {
                val name = addProductName.text
                val brand = addProductBrand.text
                val stock = addProductStock.text //convert to integer
                val price = addProductPrice.text //convert to float
                val photo = addProductPhoto.text
                val description = addProductDescription.text
                productadd(name.toString(),brand.toString(),stock.toString(),price.toString(),photo.toString(),description.toString())
            }

        }
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val spinner = view.findViewById<Spinner>(R.id.spinner2)
        val items = arrayOf("Categories", "Electronics", "Fashion", "Home", "Cosmetics", "Sports")
        val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
        if (spinner != null) {
            spinner.adapter = adapter
        }
        //val text: String = spinner.getSelectedItem().toString()
        val addProductCategories = spinner.selectedItem.toString()
    }



    fun productadd(p_name: String,p_brand: String,p_stock: String,p_price: String,p_photo: String,p_description: String){
        var p_categories="Electronics"
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<TokenResponse> = apiinterface.addProduct(p_categories,p_name,p_brand,p_stock.toInt(),p_price.toFloat(),p_photo,p_description)
        Log.w("request", call.request().toString())
        call.enqueue(object : Callback<TokenResponse?> {
            override fun onResponse(call: Call<TokenResponse?>, response: Response<TokenResponse?>) {
                //progressDialog.dismiss()
                val userResponse: TokenResponse? = response.body()
                Log.i("Status code",response.code().toString())
                val applicationContext = getActivity()?.getApplicationContext()
                if (response.body() != null) {
                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                } else {
                    Toast.makeText(applicationContext, "Error", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<TokenResponse?>, t: Throwable) {
                Log.i("Failure",t.message)
            }
        })
    }




}

