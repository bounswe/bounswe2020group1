package com.example.tursuapp.authentication.homepage.ui.home

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.BitmapFactory
import android.media.Image
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.shoppingcart.ShoppingCartFragment
import com.squareup.picasso.Picasso
import retrofit2.Call
import retrofit2.Response
import java.net.URL


class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    var adapter: ProductAdapter? = null
    var productList = ArrayList<ProductResponse>()
    var productImages = ArrayList<ImageView>()
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        homeViewModel =
                ViewModelProvider(this).get(HomeViewModel::class.java)
        val args = getArguments()
        var type = ""
        var id = ""
        if(args!=null) {
            type = args.getString("type").toString()
            id=args.getString("id").toString()
        }
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val textView: TextView = root.findViewById(R.id.text_home)
        homeViewModel.text.observe(viewLifecycleOwner, Observer {
            textView.text = it
        })

    //    val searchRoot = inflater.inflate(R.layout.app_bar_main, container, false)


        if(id=="2"){
            search(type)
        }else if(id=="1" && type!=""){
            if (type != null) {
                displayCategory(type)
            }
        }
        else {
            listAllProducts()
        }


        return root
    }

    fun search(search_string: String){

        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getSearchedProducts("product",
                search_string).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
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
                    adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { parent, view, position, id ->
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
                        }
                    }
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
    }
    fun loadImages(){

    }
    fun displayCategory(type: String){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductsOfCategory(type).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
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
                    adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { parent, view, position, id ->
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
                        }
                    }
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
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
                    adapter = context?.let { ProductAdapter(it, productList) }
                    val gridView = view?.findViewById<GridView>(R.id.gridView)
                    if (gridView != null) {
                        gridView.adapter = adapter
                        gridView.setOnItemClickListener { parent, view, position, id ->
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
                        }
                    }
                }
                //urecyclerView.adapter = ItemAdapter(userList,context)
                //adapter!!.notifyDataSetChanged()

            }


        })
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // load foods
        Log.i("HomeFragment", "here")


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
            val productView = inflator.inflate(R.layout.product_layout, null)
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