package com.example.tursuapp.authentication.homepage.ui.product

import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class ProductAddFragment: Fragment() {

    private lateinit var productaddViewModel: ProductAddModel
    private lateinit var product: ProductDetailsResponse
    lateinit var auth_token :String

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        val root = inflater.inflate(R.layout.fragment_productadd,container,false)

        val btn = root.findViewById<View>(R.id.addProduct_button) as Button
        btn.setOnClickListener {
            val addProductName: EditText? = root.findViewById(R.id.addProduct_name)
            val addProductBrand: EditText? = root.findViewById(R.id.addProduct_brand)
            val addProductStock: EditText? = root.findViewById(R.id.addProduct_stock)
            val addProductPrice: EditText? = root.findViewById(R.id.addProduct_price)
            val addProductPhoto: EditText? = root.findViewById(R.id.addProduct_photo)
            val addProductDescription: EditText? = root.findViewById(R.id.addProduct_description)

            if(addProductName!=null && addProductBrand!=null && addProductStock!=null && addProductPrice!=null && addProductPhoto!=null && addProductDescription!=null) {
                val name = addProductName.text
                val brand = addProductBrand.text
                val stock = addProductStock.text //convert to integer
                val price = addProductPrice.text //convert to float
                val photo = addProductPhoto.text
                val description = addProductDescription.text

                // Build AlertDialog
                val dialogBuilder = AlertDialog.Builder(root.context)

                // set message of alert dialog
                dialogBuilder.setMessage("Do you want to add the product?")
                        // if the dialog is cancelable
                        .setCancelable(false)
                        // positive button text and action
                        .setPositiveButton("Proceed", DialogInterface.OnClickListener {
                            dialog, id -> productadd(root,name.toString(),brand.toString(),stock.toString(),price.toString(),photo.toString(),description.toString())
                        })
                        // negative button text and action
                        .setNegativeButton("Cancel", DialogInterface.OnClickListener {
                            dialog, id -> dialog.cancel()
                        })

                // create dialog box
                val alert = dialogBuilder.create()
                // set title for alert dialog box
                alert.setTitle("Add Product")
                // show alert dialog
                alert.show()
                //

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
            view.findViewById<ImageView>(R.id.back_img).setOnClickListener {
                (activity as HomePageActivity).displayFragment(R.id.nav_home,4,"",null)
            }
    }



    fun productadd(root:View,p_name: String,p_brand: String,p_stock: String,p_price: String,p_photo: String,p_description: String) {
        val spinner = root.findViewById<Spinner>(R.id.spinner2)
        val p_categories = spinner.selectedItem.toString()
        if (p_categories != "Categories") {
            if(p_name.isEmpty() || p_brand.isEmpty() || p_stock.isEmpty() || p_price.isEmpty() || p_photo.isEmpty() || p_description.isEmpty()){
                Toast.makeText(activity?.applicationContext, "Input all product details ", Toast.LENGTH_SHORT).show()
            }else {
                if (p_price.toFloat() < 0) {
                    Toast.makeText(activity?.applicationContext, "Price must be bigger than zero", Toast.LENGTH_SHORT).show()
                } else {
                    if (p_stock.toInt() < 0) {
                        Toast.makeText(activity?.applicationContext, "Stock must be bigger than zero", Toast.LENGTH_SHORT).show()
                    } else {
                        Log.i("product add", p_categories)
                        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
                        apiinterface.addProduct(auth_token, p_categories, p_name, p_brand, p_stock.toInt(), p_price.toFloat(), p_photo, p_description).enqueue(object :
                                retrofit2.Callback<ResponseBody> {
                            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                                Log.i("MainFragment", "error" + p1?.message.toString())
                            }

                            override fun onResponse(
                                    p0: Call<ResponseBody>?,
                                    response: Response<ResponseBody>?
                            ) {
                                val applicationContext = getActivity()?.getApplicationContext()
                                if (response != null) {
                                    if (response.code() == 200) {
                                        Toast.makeText(activity?.applicationContext, "Product has been successfully added", Toast.LENGTH_SHORT).show()
                                        //showPopupWindow(view)
                                        Log.i("Status code", response.code().toString())
                                        //clear textviews
                                        spinner.setSelection(-1)
                                        root.findViewById<EditText>(R.id.addProduct_name).text.clear()
                                        root.findViewById<EditText>(R.id.addProduct_brand).text.clear()
                                        root.findViewById<EditText>(R.id.addProduct_stock).text.clear()
                                        root.findViewById<EditText>(R.id.addProduct_price).text.clear()
                                        root.findViewById<EditText>(R.id.addProduct_photo).text.clear()
                                        root.findViewById<EditText>(R.id.addProduct_description).text.clear()
                                    } else {
                                        Toast.makeText(applicationContext, response.code().toString(), Toast.LENGTH_SHORT).show()
                                    }
                                }

                            }


                        })
                    }
                }
            }
        }else {
            Toast.makeText(activity?.applicationContext, "Select a category", Toast.LENGTH_SHORT).show()

        }
    }


}

