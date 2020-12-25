package com.example.tursuapp.authentication.homepage.ui.shoppingcart

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.payment.PaymentFragment
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.shopping_cart.ShoppingCartModel
import com.squareup.picasso.Picasso
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response


class ShoppingCartFragment : Fragment() {

    private lateinit var shoppingCartViewModel: ShoppingCartModel
    var adapter: ShoppingCartFragment.ProductAdapter? = null
    private lateinit var product: ProductDetailsResponse
    var productList = ArrayList<ProductResponse>()
    var productImages = ArrayList<ImageView>()
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        shoppingCartViewModel = ViewModelProvider(this).get(ShoppingCartModel::class.java)
        val root = inflater.inflate(R.layout.fragment_shopping_cart, container, false)
        listAllProducts()
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
       super.onViewCreated(view, savedInstanceState)
        /* val id_str = requireArguments().getString("id")
        val spinner = view.findViewById<Spinner>(R.id.spinner)
        val items = arrayOf("Add to favorites","Favorites", "List 1", "List 2", "List 3")
        val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
        if (spinner != null) {
            spinner.adapter = adapter
        }
        getDetails(id_str!!.toInt(), view)*/
        view.findViewById<Button>(R.id.continueShopping).setOnClickListener(){
            val newFragment = HomeFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
        view.findViewById<Button>(R.id.GoPayment).setOnClickListener(){
            val newFragment = PaymentFragment()
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    requireFragmentManager().beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
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
    fun listAllProducts(){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProducts().enqueue(object : retrofit2.Callback<List<ProductResponse>> {
            override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<ProductResponse>>?,
                    response: Response<List<ProductResponse>>?
            ) {
                Log.i("MainFragment", productList.joinToString())
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    productList = ArrayList(response.body()!!)
                    adapter = context?.let { ShoppingCartFragment.ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridShoppingCart)
                    if (gridView != null) {
                        gridView.adapter = adapter
                       /* gridView.setOnItemClickListener { parent, view, position, id ->
                            val clicked_id = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clicked_id.toString())
                            val newFragment = ProductPageFragment()
                            newFragment.arguments = bundle;
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }*/
                    }
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
    }
    class ProductAdapter : BaseAdapter {
        var productList = ArrayList<ProductResponse>()
        var productImages = ArrayList<ImageView>()
        var context: Context? = null

        constructor(context: Context, productList: ArrayList<ProductResponse>) : super() {
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

            productView.findViewById<TextView>(R.id.shoppingcartProductPrice).text = this.productList[position].price + " TL"
            productView.findViewById<TextView>(R.id.ProductName).text = this.productList[position].name
            val image  = productView.findViewById<ImageView>(R.id.shoppingcartProductImage)
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