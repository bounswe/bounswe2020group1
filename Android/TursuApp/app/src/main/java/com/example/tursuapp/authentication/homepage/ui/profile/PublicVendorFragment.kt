package com.example.tursuapp.authentication.homepage.ui.profile

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.example.tursuapp.R
import com.example.tursuapp.adapter.PublicVendorInfoAdapter
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.PublicVendorProductLists
import com.example.tursuapp.api.responses.PublicVendorResponse
import com.example.tursuapp.api.responses.VendorDataResponse
import com.example.tursuapp.api.responses.VendorProductLists
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageFragment
import retrofit2.Call
import retrofit2.Response

class PublicVendorFragment: Fragment()  {
    var verifiedVendors = listOf<String>() //verified vendor list
    var vendorProductList = ArrayList<PublicVendorProductLists>()
    lateinit var gridView: GridView
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_publicvendorpage, container, false)
        getVerifiedVendors()
        return root
    }
    private fun listVendorProducts(vendor_name:String,view: View){
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getPublicVendorInfo(vendor_name).enqueue(object : retrofit2.Callback<PublicVendorResponse> {
            override fun onFailure(p0: Call<PublicVendorResponse>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<PublicVendorResponse>?,
                    response: Response<PublicVendorResponse>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        view.findViewById<TextView>(R.id.public_name_view).text = response.body()!!.first_name
                        view.findViewById<TextView>(R.id.public_city_view).text = response.body()!!.city
                        Log.i("rating: ", response.body()!!.rating)
                        view.findViewById<RatingBar>(R.id.public_ratingBar).rating = response.body()!!.rating.toFloat()
                        if (verifiedVendors.find { vendor -> response.body()!!.first_name == vendor } != null) { //then the vendor is verified
                            view.findViewById<ImageView>(R.id.is_verified).visibility=View.VISIBLE
                        }else{
                            view.findViewById<ImageView>(R.id.is_verified).visibility=View.INVISIBLE
                        }
                        vendorProductList=ArrayList(response.body()!!.products)
                        val adapter = context?.let { PublicVendorInfoAdapter(it, vendorProductList) }
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()

                        }
                    }else{
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val vendor_name = requireArguments().getString("vendor_name")
        gridView = view.findViewById(R.id.public_gridView)
        listVendorProducts(vendor_name.toString(),view)
        view.findViewById<ImageView>(R.id.public_back_img).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
        }
    }
    //take verified vendors
    private fun getVerifiedVendors(){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getAllVendors().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<List<String>>?,
                    response: Response<List<String>>?
            ) {
                if (response != null) {
                    verifiedVendors = response.body()!!
                }

            }

        })
    }

}