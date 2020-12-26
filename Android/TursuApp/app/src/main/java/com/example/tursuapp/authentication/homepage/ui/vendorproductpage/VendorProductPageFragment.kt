package com.example.tursuapp.authentication.homepage.ui.vendorproductpage

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.*
import com.squareup.picasso.Picasso
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageModel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class VendorProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: VendorProductPageModel
    private lateinit var product: ProductDetailsResponse
    var vendorProductList = ArrayList<VendorProductLists>()
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {



        activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        activity?.findViewById<EditText>(R.id.editMobileNo)!!.visibility = View.INVISIBLE
        activity?.findViewById<Button>(R.id.search_button)!!.visibility = View.INVISIBLE
        productPageViewModel = ViewModelProvider(this).get(VendorProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_vendorproductpage, container, false)
        root.findViewById<ImageView>(R.id.update_product_img)?.setOnClickListener {
            //open popup with product data and update the product
            showPopupWindow(it)
        }
        root.findViewById<ImageView>(R.id.delete_product_img)?.setOnClickListener {
            //Do delete operation
            deleteProduct(it)
            listVendorProducts()

        }
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        getDetails(id_str!!.toInt(), view)
    }

    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.update_product_popup_layout, null)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //val width = LinearLayout.LayoutParams.WRAP_CONTENT
        //val height = LinearLayout.LayoutParams.WRAP_CONTENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)

        popupView.findViewById<ImageView>(R.id.dismiss_pop_up).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.update_button).setOnClickListener {

            //popupWindow.dismiss()
            //showPopupWindow(popupView)
        }

    }

    fun getDetails(id: Int, view: View){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductDetails(id).enqueue(object :
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
            }


        })
    }

    fun displayProductInfo(view: View){
        view.findViewById<TextView>(R.id.product_name).text = product.name
        view.findViewById<TextView>(R.id.product_description).text = product.description
        //view.findViewById<RatingBar>(R.id.ratingBar).rating = product.rating.toFloat()
        view.findViewById<TextView>(R.id.price).text = product.price+" TL"
        view.findViewById<TextView>(R.id.vendor).text = "Vendor: "+product.vendor_name

        val image  = view.findViewById<ImageView>(R.id.productImage)
        if(product.photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(product.photo_url) // load the image
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
    }
    private fun deleteProduct(view: View) {
        val id = product.id
        if (id != null) {

            //Authorization: token f057f527f56398e8041a1985919317a5c0cc2e77
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteProduct("token 8032e2a35b4663ae5c6d6ccfc59876dfd80b260b", id).enqueue(object :
                    retrofit2.Callback<DeleteProductResponse> {
                override fun onFailure(p0: Call<DeleteProductResponse>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<DeleteProductResponse>?,
                        response: Response<DeleteProductResponse>?
                ) {

                    if (response != null) {
                        Toast.makeText(activity?.applicationContext, "Success", Toast.LENGTH_SHORT).show()
                        //showPopupWindow(view)
                        Log.i("Status code", response.code().toString())
                        // AddListStatus = response.body()!!

                    }

                }

            })

          }
    }
    private fun listVendorProducts() {
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductsOfVendor("token 8032e2a35b4663ae5c6d6ccfc59876dfd80b260b").enqueue(object : retrofit2.Callback<VendorDataResponse> {
            override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<VendorDataResponse>?,
                    response: Response<VendorDataResponse>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        vendorProductList=ArrayList(response.body()!!.products)
                        val adapter = context?.let { VendorProductAdapter(it, vendorProductList) }
                        val gridView = view?.findViewById<GridView>(R.id.gridView)
                        if (gridView != null) {
                            gridView.adapter = adapter
                            gridView.setOnItemClickListener { _, view, _, _ ->
                                val clickedId = view.findViewById<TextView>(R.id.product_id).text
                                val bundle = Bundle()
                                bundle.putString("id", clickedId.toString())
                                val newFragment = VendorProductPageFragment()
                                newFragment.arguments = bundle
                                val fragmentManager: FragmentManager? = fragmentManager
                                val fragmentTransaction: FragmentTransaction =
                                        fragmentManager!!.beginTransaction()
                                fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                                fragmentTransaction.commit()
                            }
                        }
                    }else{
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    class VendorProductAdapter : BaseAdapter {
        var productList = ArrayList<VendorProductLists>()
        var productImages = ArrayList<ImageView>()
        var context: Context? = null

        constructor(context: Context, productList: ArrayList<VendorProductLists>) : super() {
            this.context = context
            this.productList = productList
        }

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        @SuppressLint("SetTextI18n")
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            //val food = this.productList[position]

            val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val productView = inflator.inflate(R.layout.product_for_shopping_cart, null)
            //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
            productView.findViewById<TextView>(R.id.product_id).text = this.productList[position].id.toString()
            productView.findViewById<TextView>(R.id.price_product).text = this.productList[position].price + " TL"
            productView.findViewById<TextView>(R.id.text_product).text = this.productList[position].name
            val image  = productView.findViewById<ImageView>(R.id.img_product)
            Picasso
                    .get() // give it the context
                    .load(productList[position].photo_url) // load the image
                    .into(image)
            //val url = URL(productList[position].photo_url)
            //val bmp = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            //productView.findViewById<ImageView>(R.id.img_product).setImageBitmap(bmp)
            return productView
        }
    }
}