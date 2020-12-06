package com.example.tursuapp.authentication.homepage.ui.home

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
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.squareup.picasso.Picasso
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Response
/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
 */

@Suppress("DEPRECATION", "UNCHECKED_CAST")
class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    var adapter: ProductAdapter? = null
    var productList = ArrayList<ProductResponse>()
    var filters:HashMap<String,String> ?= null
    var type = 0
    var keys = ""
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        setFilterFunction()
        homeViewModel =
                ViewModelProvider(this).get(HomeViewModel::class.java)
        val args = arguments
        if(args!=null) {
            type = args.getInt("type")
            setButtonVisibilities(type)
            if(type!=0) {
                keys = args.getString("keys").toString()
            }
        }
        else{
            //if args is null (firstly opening main screen), then filter image is invisible
            activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        }
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val textView: TextView = root.findViewById(R.id.text_home)
        homeViewModel.text.observe(viewLifecycleOwner, {
            textView.text = it
        })
        when (type) {
            0 -> {
                //all products
                listAllProducts()
            }
            1 -> {
                //category
                displayCategory(keys)
            }
            2 -> {
                //search
                search(keys)
            }
            else -> {
                listAllProducts()
            }
        }
        return root
    }
    private fun setButtonVisibilities(type:Int){
        val filterImage = activity?.findViewById<ImageView>(R.id.filter_image)
        val searchBar = activity?.findViewById<EditText>(R.id.editMobileNo)
        val searchButton = activity?.findViewById<Button>(R.id.search_button)
        //listing all products
        if(type==0){
            filterImage!!.visibility = View.INVISIBLE
            searchBar!!.visibility = View.VISIBLE
            searchButton!!.visibility = View.VISIBLE
        }
        //category screen
        else if(type==1){
            filterImage!!.visibility = View.VISIBLE
            searchBar!!.visibility = View.INVISIBLE
            searchButton!!.visibility = View.INVISIBLE
        }
        //search screen
        else if(type==2){
            filterImage!!.visibility = View.VISIBLE
            searchBar!!.visibility = View.VISIBLE
            searchButton!!.visibility = View.VISIBLE
        }
    }
    private fun setFilterFunction(){
        val filter = activity?.findViewById<ImageView>(R.id.filter_image)
        filter?.setOnClickListener {
            showPopupWindow(it)
        }
    }
    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.filter_popup_layout, null)
        (activity as HomePageActivity).setVendorRadioButtons(popupView)
        (activity as HomePageActivity).setBrandRadioButtons(popupView)
        (activity as HomePageActivity).setCategoryRadioButtons(popupView)
        (activity as HomePageActivity).setRatingRadioButtons(popupView)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
        popupView.findViewById<ImageView>(R.id.dismiss_popup).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.apply_filters).setOnClickListener {
            applyFilters(popupView)
            popupWindow.dismiss()
        }
    }
    private fun applyFilters(view: View){
        val filters = hashMapOf<String,String>()
        if(view.findViewById<EditText>(R.id.editminPrice).text.isNotEmpty()){
            val minPrice = view.findViewById<EditText>(R.id.editminPrice).text.toString()
            filters["minprice"] = minPrice
        }
        if(view.findViewById<EditText>(R.id.editmaxPrice).text.isNotEmpty()){
            val maxPrice = view.findViewById<EditText>(R.id.editmaxPrice).text.toString()
            filters["maxprice"] = maxPrice
        }
        val selectedId = view.findViewById<RadioGroup>(R.id.radioGroupSortby).checkedRadioButtonId
        if(selectedId!=-1){
            val radioButton = view.findViewById<RadioButton>(selectedId)
            filters["sortby"] = radioButton.text.toString()
        }
        val selectedId2 = view.findViewById<RadioGroup>(R.id.radioGroupVendors).checkedRadioButtonId
        if(selectedId2!=-1){
            val radioButton2 = view.findViewById<RadioButton>(selectedId2)
            filters["vendor"] = radioButton2.text.toString()
        }
        val selectedId3 = view.findViewById<RadioGroup>(R.id.radioGroupCategory).checkedRadioButtonId
        if(selectedId3!=-1){
            val radioButton3 = view.findViewById<RadioButton>(selectedId3)
            filters["category"] = radioButton3.text.toString()
        }
        val selectedId4 = view.findViewById<RadioGroup>(R.id.radioGroupBrands).checkedRadioButtonId
        if (selectedId4!=-1){
            val radioButton4 = view.findViewById<RadioButton>(selectedId4)
            filters["brand"] = radioButton4.text.toString()
        }
        val selectedId5 = view.findViewById<RadioGroup>(R.id.radioGroupRating).checkedRadioButtonId
        if(selectedId5!=-1){
            val radioButton5 = view.findViewById<RadioButton>(selectedId5)
            filters["rating"] = radioButton5.text.toString()
        }
        //displayFragment(R.id.nav_home,2,searchString,filters)
        if(type==2){
            search(keys)
        }
        else if(type==1){
            displayCategory(keys)
        }
        Log.i("FilterActivity",filters.toString())
    }
    private fun search(search_string: String){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        if(filters!=null){
            filters!!.put("search_type","product")
            filters!!.put("search_string",search_string)
            apiinterface.getSearchedProductsFiltered(filters!!).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
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
                            gridView.setOnItemClickListener { _, view, position, id ->
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
                        }
                    }
                }
            })
        }
        else{
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
                            gridView.setOnItemClickListener { _, view, position, id ->
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
                        }
                    }
                }
            })
        }


    }
    private fun displayCategory(type: String){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        if(filters!=null){
            filters!!["name"] = type
            apiinterface.getProductsOfCategoryFiltered(filters!!).enqueue(object : retrofit2.Callback<List<ProductResponse>> {
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
                        }
                    }
                    //urecyclerView.adapter = ItemAdapter(userList,context)
                    //adapter!!.notifyDataSetChanged()

                }


            })
        }
        else {
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
                        }
                    }
                    //urecyclerView.adapter = ItemAdapter(userList,context)
                    //adapter!!.notifyDataSetChanged()

                }


            })
        }
    }
    private fun listAllProducts(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
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

    class ProductAdapter(context: Context, var productList: ArrayList<ProductResponse>) : BaseAdapter() {
        var context: Context? = context

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
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