package com.example.tursuapp.authentication.homepage.ui.productpage

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
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.squareup.picasso.Picasso
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response


class ProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: ProductPageModel
    private lateinit var product: ProductDetailsResponse
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        activity?.findViewById<EditText>(R.id.editMobileNo)!!.visibility = View.INVISIBLE
        activity?.findViewById<Button>(R.id.search_button)!!.visibility = View.INVISIBLE
        productPageViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productpage, container, false)
        return root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        val spinner = view.findViewById<Spinner>(R.id.spinner)
        val items = arrayOf("Add to favorites","Favorites", "List 1", "List 2", "List 3")
        val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
        if (spinner != null) {
            spinner.adapter = adapter
        }
        getDetails(id_str!!.toInt(), view)
    }
    fun getDetails(id: Int, view: View){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductDetails(id).enqueue(object :
            retrofit2.Callback<ProductDetailsResponse> {
            override fun onFailure(p0: Call<ProductDetailsResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<ProductDetailsResponse>?,
                response: Response<ProductDetailsResponse>?
            ) {
                if (response != null) {
                    product = response.body()!!
                    displayProductInfo(view)
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
    }

    fun displayProductInfo(view: View){
        view.findViewById<TextView>(R.id.product_name).text = product.name
        view.findViewById<TextView>(R.id.product_description).text = product.description
        view.findViewById<RatingBar>(R.id.ratingBar).rating = product.rating.toFloat()
        view.findViewById<TextView>(R.id.price).text = product.price+" TL"
        view.findViewById<TextView>(R.id.vendor).text = "Vendor: "+product.vendor_name

        val image  = view.findViewById<ImageView>(R.id.productImage)
        Picasso
            .get() // give it the context
            .load(product.photo_url) // load the image
            .into(image)
    }
}