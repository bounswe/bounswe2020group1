package com.example.tursuapp.authentication.homepage.ui.home

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.adapter.SingleProductAdapter
import com.example.tursuapp.adapter.ParentAdapter
import com.example.tursuapp.adapter.VendorAdapter
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.*
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.homepage.ui.order.VendorOrderFragment
import com.example.tursuapp.authentication.homepage.ui.product.ProductAddFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.google.android.material.button.MaterialButton
import com.google.android.material.button.MaterialButtonToggleGroup
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response


/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
Type 5 -> account
 */

@Suppress("DEPRECATION", "UNCHECKED_CAST")
class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    lateinit var auth_token:String
    lateinit var user_type:String
    var productList = ArrayList<ProductResponse>()
    var allLists = listOf<String>()
    lateinit var recyclerView:RecyclerView
    var vendorList = ArrayList<VendorResponse>()
    private var filters: HashMap<String, String>? = null
    private var type = 0
    private var keys = ""
    private var searchType = "product"
    private lateinit var btnVendor: MaterialButton
    private lateinit var btnProduct: MaterialButton
    private lateinit var toggleGroup: MaterialButtonToggleGroup
    private val filterDictionary = mapOf(
        "Bestsellers" to "bestseller",
        "Newest" to "newest",
        "Ascending Price" to "priceAsc",
        "Descending Price" to "priceDesc",
        "Number of Comments" to "numComments"
    )
    var vendorProductList = ArrayList<VendorProductLists>()
    lateinit var gridView:RecyclerView



    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setFilterFunction()
        homeViewModel = ViewModelProvider(this).get(HomeViewModel::class.java)
        val args = arguments
        filters = hashMapOf()
        if (args != null) {
            // get operation type from the arguments
            /*
            Type 0 -> all products
            Type 1 -> category
            Type 2 -> search
            Type 3 -> filter
            Type 4 -> sort
            Type 5 -> account
             */
            type = args.getInt("type")
            setButtonVisibilities(type)
            //if the type is not listing all products -> there must be a key like "Sports"
            if (type != 0) {
                keys = args.getString("keys").toString()
            }
        } else {
            //if args is null (firstly opening main screen), then filter image is invisible
            activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        }
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        return root
    }

    private fun setButtonVisibilities(type: Int) {
        val filterImage = activity?.findViewById<ImageView>(R.id.filter_image)
        val searchBar = activity?.findViewById<EditText>(R.id.editMobileNo)
        val searchButton = activity?.findViewById<Button>(R.id.search_button)
        //listing all products
        when (type) {
            0 -> {
                filterImage!!.visibility = View.INVISIBLE
                searchBar!!.visibility = View.VISIBLE
                searchButton!!.visibility = View.VISIBLE
            }
            //category screen
            1 -> {
                filterImage!!.visibility = View.INVISIBLE
                searchBar!!.visibility = View.VISIBLE
                searchButton!!.visibility = View.VISIBLE
            }
            //search screen
            2 -> {
                filterImage!!.visibility = View.VISIBLE
                searchBar!!.visibility = View.VISIBLE
                searchButton!!.visibility = View.VISIBLE
            }
        }
    }

    private fun setFilterFunction() {
        val filter = activity?.findViewById<ImageView>(R.id.filter_image)
        filter?.setOnClickListener {
            showPopupWindow(it)
        }


    }
    //Home fragment contains both a nested recycler view for recommended products
    // and a grid view to list products in a category or coming from a search
    fun disableRecommendationEnableGrid(){
        gridView.visibility = View.VISIBLE
        recyclerView.visibility = View.GONE
    }
    // Pop up for shopping lists
    @SuppressLint("InflateParams")
    private fun showPopupWindowForLists(view: View) {
        Log.i("showPopup:", "here")
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.fragment_shopping_lists, null)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
        popupView.findViewById<ImageView>(R.id.dismiss_popup3).setOnClickListener {
            popupWindow.dismiss()
            listRecommendedProducts()
        }
        //get shopping lists
        getLists(popupView)
        //add a new list to shopping lists
        popupView.findViewById<Button>(R.id.h_add_new_List_button).setOnClickListener {
            addList(popupView, popupWindow)
        }
        //delete a list from shopping lists
        popupView.findViewById<Button>(R.id.h_delete_List_button).setOnClickListener {
            deleteList(popupView, popupWindow)
        }
        //gets products from the selected shopping list
        popupView.findViewById<Button>(R.id.h_show_products).setOnClickListener {
            showListedProducts(popupView, popupWindow)


        }
    }
    // Pop up for filtering function
    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.filter_popup_layout, null)
        (activity as HomePageActivity).setVendorCheckBoxes(popupView)
        (activity as HomePageActivity).setBrandCheckBoxes(popupView)
        (activity as HomePageActivity).setCategoryCheckBoxes(popupView)
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
    // get chosen filters
    private fun applyFilters(view: View) {
        filters = hashMapOf()
        if (view.findViewById<EditText>(R.id.editminPrice).text.isNotEmpty()) {
            val minPrice = view.findViewById<EditText>(R.id.editminPrice).text.toString()
            filters?.set("fprice_lower", minPrice)
        }
        if (view.findViewById<EditText>(R.id.editmaxPrice).text.isNotEmpty()) {
            val maxPrice = view.findViewById<EditText>(R.id.editmaxPrice).text.toString()
            filters?.set("fprice_upper", maxPrice)
        }
        val selectedId = view.findViewById<RadioGroup>(R.id.radioGroupSortby).checkedRadioButtonId
        if (selectedId != -1) {
            val radioButton = view.findViewById<RadioButton>(selectedId)
            filterDictionary[radioButton.text.toString()]?.let { filters?.put("sort_by", it) }
        }

        val selectedVendors: MutableList<String> = mutableListOf<String>()
        val selectedBrands: MutableList<String> = mutableListOf<String>()
        val selectedCategories: MutableList<String> = mutableListOf<String>()
        //get checked vendor names
        for (vendor in (activity as HomePageActivity).checkboxVendors)  {
            if (vendor.isChecked){
                selectedVendors.add(vendor.text.toString())
            }
        }
        //Log.i("selectedVendors:",selectedVendors.toString())

        //get checked brand names
        for (brand in (activity as HomePageActivity).checkboxBrands)  {
            if (brand.isChecked){
                selectedBrands.add(brand.text.toString())
            }
        }
        //Log.i("selectedBrands:",selectedBrands.toString())

        //get checked category names
        for (category in (activity as HomePageActivity).checkboxCategories)  {
            if (category.isChecked){
                selectedCategories.add(category.text.toString())
            }
        }
        //Log.i("selectedCategories:",selectedCategories.toString())

        if(selectedVendors.isNotEmpty()) {
            var concatenateVendors = ""
            for (vendor in selectedVendors) {
                concatenateVendors += "$vendor|" //concatenate items with |
            }
            val concatenatedVendors = concatenateVendors.subSequence(
                0,
                (concatenateVendors.length - 1)
            ).toString() //get rid of the last char(|)
            //Log.i("concatenatedVendors:", concatenatedVendors)
            filters?.set("fvendor_name", concatenatedVendors)
        }else if(selectedVendors.size==1){ //selected only one vendor
            filters?.set("fvendor_name", selectedVendors[0])
        }

        if(selectedBrands.isNotEmpty()) {
            var concatenateBrands = ""
            for (brand in selectedBrands) {
                concatenateBrands += "$brand|" //concatenate items with |
            }
            val concatenatedBrands = concatenateBrands.subSequence(
                0,
                (concatenateBrands.length - 1)
            ).toString() //get rid of the last char(|)
            //Log.i("concatenatedBrands:", concatenatedBrands)
            filters?.set("fbrand", concatenatedBrands)
        }else if(selectedBrands.size==1){ //selected only one brand
            filters?.set("fbrand", selectedBrands[0])
        }

        if(selectedCategories.isNotEmpty()) {
            var concatenateCategories = ""
            for (category in selectedCategories) {
                concatenateCategories += "$category|" //concatenate items with |
            }
            val concatenatedCategories = concatenateCategories.subSequence(
                0,
                (concatenateCategories.length - 1)
            ).toString() //get rid of the last char(|)
            //Log.i("concatenatedCategories:", concatenatedCategories)
            filters?.set("fcategory", concatenatedCategories)
        }else if(selectedCategories.size==1){ //selected only one category
            filters?.set("fcategory", selectedCategories[0])
        }

        /*
        val selectedId2 = view.findViewById<RadioGroup>(R.id.radioGroupVendors).checkedRadioButtonId
        if (selectedId2 != -1) {
            val radioButton2 = view.findViewById<RadioButton>(selectedId2)
            filters?.set("fvendor_name", radioButton2.text.toString())
        }
        val selectedId3 = view.findViewById<RadioGroup>(R.id.radioGroupCategory).checkedRadioButtonId
        if (selectedId3 != -1) {
            val radioButton3 = view.findViewById<RadioButton>(selectedId3)
            filters?.set("fcategory", radioButton3.text.toString())
        }
        val selectedId4 = view.findViewById<RadioGroup>(R.id.radioGroupBrands).checkedRadioButtonId
        if (selectedId4 != -1) {
            val radioButton4 = view.findViewById<RadioButton>(selectedId4)
            filters?.set("fbrand", radioButton4.text.toString())
        }
         */
        val selectedId5 = view.findViewById<RadioGroup>(R.id.radioGroupRating).checkedRadioButtonId
        if (selectedId5 != -1) {
            val radioButton5 = view.findViewById<RadioButton>(selectedId5)
            filters?.set("frating_gte", radioButton5.text.toString())
        }
        if (type == 2) {
            search(keys)
        } else if (type == 1) {
            displayCategory(keys)
        }
        Log.i("FilterActivity", filters.toString())
    }

    private fun search(search_string: String) {
        if (searchType == "product") {
            searchProduct(search_string)
        } else {
            searchVendor(search_string)
        }
        toggleGroup.visibility = View.VISIBLE

    }
    // searhing for vendor names
    private fun searchVendor(search_string: String) {

        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getSearchedVendors(searchType, search_string).enqueue(object :
            retrofit2.Callback<List<VendorResponse>> {
            override fun onFailure(p0: Call<List<VendorResponse>>?, p1: Throwable?) {
                Log.i("SearchFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<VendorResponse>>?,
                response: Response<List<VendorResponse>>?
            ) {

                Log.i("ProductList", productList.joinToString())
                Log.i("SearchFragment", "inside onResponse")
                if (response != null) {
                    vendorList = ArrayList(response.body()!!)
                    val adapter = context?.let { VendorAdapter(it, vendorList) }
                    disableRecommendationEnableGrid()
                    gridView.adapter = adapter
                }
            }
        })

    }
    //searching for products
    private fun searchProduct(search_string: String) {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        filters!!["search_type"] = searchType
        filters!!["search_string"] = search_string
        Log.i("filter: ", filters!!.toString())
        apiinterface.getSearchedProducts(filters!!).enqueue(object :
            retrofit2.Callback<List<ProductResponse>> {
            override fun onFailure(p0: Call<List<ProductResponse>>?, p1: Throwable?) {
                Log.i("SearchFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<ProductResponse>>?,
                response: Response<List<ProductResponse>>?
            ) {

                Log.i("ProductList", productList.joinToString())
                Log.i("SearchFragment", "inside onResponse")
                if (response != null) {
                    productList = ArrayList(response.body()!!)
                    val adapter = context?.let { SingleProductAdapter(it, productList) }
                    disableRecommendationEnableGrid()
                    gridView.adapter = adapter
                }
            }
        })


    }
    //get shopping lists of customer
    private fun getLists(view: View) {
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getLists(auth_token).enqueue(object :
            retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                //Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<String>>?,
                response: Response<List<String>>?
            ) {
                if (response != null) {
                    Log.i("Status code", response.code().toString())
                    if (response.code() == 200) {
                        allLists = response.body()!!
                        val radioGroup = view.findViewById<RadioGroup>(R.id.h_radioGroupLists)
                        for (list in allLists) {
                            Log.i("List:", list)
                            val btn1 = RadioButton(activity?.applicationContext)
                            btn1.text = list
                            radioGroup.addView(btn1)
                        }
                    } else {
                        Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }


                }


            }

        })

    }
    // adding a new shopping list
    private fun addList(view: View, window: PopupWindow){
        if(view.findViewById<EditText>(R.id.h_new_list_txt).text.isNotEmpty()){
            val listName = view.findViewById<EditText>(R.id.h_new_list_txt).text.toString()
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addList(auth_token, listName).enqueue(object :
                retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
                ) {

                    if (response != null) {
                        Log.i("Status code", response.code().toString())
                        if (response.code() == 200) {
                            Toast.makeText(
                                context,
                                "List has been successfully added",
                                Toast.LENGTH_SHORT
                            ).show()
                            window.dismiss()
                            showPopupWindowForLists(view)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT)
                                .show()
                        }

                    }

                }


            })

        }else{
            Toast.makeText(context, "Please input a list name", Toast.LENGTH_SHORT).show()
        }
    }
    // deleting a shopping list
    private fun deleteList(view: View, window: PopupWindow){
        if(view.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = view.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteList(auth_token, listName).enqueue(object :
                retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
                ) {
                    if (response != null) {
                        Log.i("Status code", response.code().toString())
                        if (response.code() == 200) {
                            Toast.makeText(
                                context,
                                "List has been successfully deleted",
                                Toast.LENGTH_SHORT
                            ).show()
                            window.dismiss()
                            showPopupWindowForLists(view)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT)
                                .show()
                        }

                    }

                }

            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }

    }

    private fun showListedProducts(root: View, window: PopupWindow) {
        if(root.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = root.findViewById<RadioGroup>(R.id.h_radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = root.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.getListedProducts(auth_token, listName).enqueue(object :
                retrofit2.Callback<List<ProductResponse>> {
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

                        val adapter = context?.let { SingleProductAdapter(it, productList) }
                        disableRecommendationEnableGrid()
                        gridView.adapter = adapter
                        window.dismiss()
                    }

                }

            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }


    }

    private fun displayAccountSubItems(view: View, type: String) {
        Log.i("accountSub: ", type)
        if (type == "Shopping Lists") {
            showPopupWindowForLists(view)
        } else if (type == "Profile") {
            displayFragment(R.id.nav_profile_detail)
        } else if (type == "Orders") {
            if(user_type=="customer"){
                displayFragment(R.id.nav_customer_orders)
            }
            else{
                displayFragment(R.id.nav_vendor_order)
            }

        }else if (type == "My Products") {
            listVendorProducts()
        }else if (type == "Product Add") {
            displayFragment(R.id.nav_product_add)
        }

    }

    private fun listVendorProducts() {
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductsOfVendor(auth_token).enqueue(object :
            retrofit2.Callback<VendorDataResponse> {
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
                        vendorProductList = ArrayList(response.body()!!.products)
                        val adapter = context?.let { VendorProductAdapter(it, vendorProductList) }
                        disableRecommendationEnableGrid()
                        gridView.adapter = adapter

                    } else {
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }


    private fun displayFragment(id: Int) {
        lateinit var fragment: Fragment
        when (id) {
            R.id.nav_profile_detail -> {
                fragment = ProfileFragment()
            }
            R.id.nav_customer_orders -> {
                fragment = CustomerOrdersFragment()
            }
            R.id.nav_product_add -> {
                fragment = ProductAddFragment()
            }
            R.id.nav_vendor_order -> {
                fragment = VendorOrderFragment()
            }
        }
        activity?.supportFragmentManager?.beginTransaction()
                ?.replace(R.id.nav_host_fragment, fragment)?.addToBackStack(null)
                ?.commit()
        (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
    }

    private fun displayCategory(type: String) {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        filters!!["name"] = type
        apiinterface.getProductsOfCategory(filters!!).enqueue(object :
            retrofit2.Callback<List<ProductResponse>> {
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
                    val adapter = context?.let { SingleProductAdapter(it, productList) }
                    disableRecommendationEnableGrid()
                    gridView.adapter = adapter

                }

            }


        })
    }
    private fun enableRecommendationDisableGrid(){
        gridView.visibility = View.GONE
        recyclerView.visibility = View.VISIBLE
    }

    private fun listRecommendedProducts(){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        enableRecommendationDisableGrid()
        val parentList = mutableListOf<ParentModel>()
        apiinterface.getRecommendedProducts(auth_token).enqueue(object :
            retrofit2.Callback<RecommendationPackResponse> {

            override fun onFailure(p0: Call<RecommendationPackResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            @SuppressLint("WrongConstant")
            override fun onResponse(
                p0: Call<RecommendationPackResponse>?,
                response: Response<RecommendationPackResponse>?
            ) {

                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    val body = response.body()
                    if (body != null) {
                        if (body.recommended.isNotEmpty()) {
                            val parent1 = ParentModel(
                                title = "Recommended Products", ArrayList(
                                    response.body()?.recommended!!
                                )
                            )
                            parentList.add(parent1)
                        }
                        val parent2 = ParentModel(
                            title = "Bestsellers",
                            ArrayList(response.body()?.bestseller!!)
                        )
                        val parent3 = ParentModel(
                            title = "Top Rated Products",
                            ArrayList(response.body()?.toprated!!)
                        )
                        val parent4 = ParentModel(
                            title = "Newest Arrivals",
                            ArrayList(response.body()?.newest!!)
                        )

                        parentList.add(parent2)
                        parentList.add(parent3)
                        parentList.add(parent4)

                        recyclerView.apply {
                            layoutManager = LinearLayoutManager(
                                context,
                                LinearLayout.VERTICAL, false
                            )
                            adapter = ParentAdapter(context, parentList)
                        }
                        /*
                        var isRecommended = true
                        if(recommList.size==0){
                            isRecommended = false
                        }

                         */

                    }
                }
            }
        })
    }
/*
    private fun listAllProducts() {
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
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
                    val adapter = context?.let { ProductAdapter(it, productList) }
                    disableRecommendationEnableGrid()
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
                }

            }


        })
    }

 */

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // load foods
        Log.i("HomeFragment", "here")
        toggleGroup = view.findViewById(R.id.toggle_button_group)
        btnProduct = view.findViewById(R.id.btn_product)
        btnVendor = view.findViewById(R.id.btn_vendor)
        gridView = view.findViewById(R.id.gridView)
        gridView.layoutManager = GridLayoutManager(context, 2)
        recyclerView = view.findViewById(R.id.rv_parent)
        toggleGroup.check(btnProduct.id)
        toggleGroup.addOnButtonCheckedListener { group, checkedId, isChecked ->
            if (isChecked) {
                if (checkedId == btnProduct.id) {
                    searchType = "product"
                    search(keys)
                    activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.VISIBLE
                } else {
                    searchType = "vendor"
                    search(keys)
                    activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
                }
            } else {
                //Something is unchecked, we need to make sure that all the buttons are not un-selected
                if (-1 == group.checkedButtonId) {
                    //All buttons are unselected
                    //So now we will select the button which was unselected right now
                    group.check(checkedId)
                }
            }

        }
        when (type) {
            0 -> {
                //all products
                //listAllProducts()
                listRecommendedProducts()
            }
            1 -> {
                //category
                displayCategory(keys)
            }
            2 -> {
                //search
                search(keys)
            }
            5 -> {
                //account
                Log.i("Account", "here")
                displayAccountSubItems(view, keys)
            }
            else -> {
                listRecommendedProducts()
            }
        }
        Log.i("HomeFragment", "here")
    }


}

data class ParentModel(
    val title: String = "",
    val children: List<ProductResponse>
)