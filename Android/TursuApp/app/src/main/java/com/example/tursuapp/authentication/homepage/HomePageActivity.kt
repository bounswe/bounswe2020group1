package com.example.tursuapp.authentication.homepage

import android.app.Activity
import android.os.Bundle
import android.text.Editable
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.cardview.widget.CardView
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.navigation.findNavController
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.adapter.ExpandableListAdapter
import com.example.tursuapp.authentication.homepage.ui.account.AccountFragment
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.shoppingcart.ShoppingCartFragment
import com.google.android.material.navigation.NavigationView
import retrofit2.Call
import retrofit2.Response


/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
 */
@Suppress("DEPRECATION")
class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    private var listAdapter: ExpandableListAdapter? = null
    private var expListView: ExpandableListView? = null
    private var listDataHeader: MutableList<String>? = null
    private var listDataChild: HashMap<String, List<String>>? = null
    lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle
    private var searchString = ""
    var allVendors = listOf<String>()
    var allBrands = listOf<String>()
    var allCategories = listOf<String>()

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        //otomatik kapanması için
        drawer.closeDrawer(GravityCompat.START)
        return true
    }
    private fun setAppBar(){
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener(this)
        drawer = findViewById(R.id.drawer_layout)
        toggle = ActionBarDrawerToggle(this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer.addDrawerListener(toggle)
        toggle.syncState()
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
    }
    private fun hideSoftKeyboard(activity: Activity) {
        val inputMethodManager: InputMethodManager = activity.getSystemService(
                INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.hideSoftInputFromWindow(
                activity.currentFocus!!.windowToken, 0)
    }
    private fun setExpandableSideMenu(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener { _, _, groupPosition, _ ->
            if (groupPosition == 0) {
                displayStandardFragment(R.id.nav_account)
                //isFilterAvailable = false
                //filterImage.visibility = View.GONE
            }
            if (groupPosition == 1) {
                displayFragment(R.id.nav_home, 0, "", null)
                //isFilterAvailable = false
                //filterImage.visibility = View.GONE
            }
            false
        }
        expListView!!.setOnChildClickListener { _, _, groupPosition, childPosition, _ ->
            // Kategoriye basılınca olacakları ayarla
            if (groupPosition == 2) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics", null)
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion", null)
                    2 -> displayFragment(R.id.nav_home, 1, "Home", null)
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics", null)
                    4 -> displayFragment(R.id.nav_home, 1, "Sports", null)
                }
                //isFilterAvailable = true
                //filterImage.visibility = View.VISIBLE
            }

            false
        }
        expListView!!.setSelectedGroup(0)
    }

    private fun setSearchFunction(){
        this.findViewById<Button>(R.id.search_button).setOnClickListener {
            val editText: EditText? = findViewById(R.id.editMobileNo)
            editText?.setOnClickListener {
                editText.text?.clear()
            }
            if (editText != null) {
                searchString=editText.text.toString()
                displayFragment(R.id.nav_home, 2, searchString, null)
            }
            hideSoftKeyboard(this)
        }

        this.findViewById<CardView>(R.id.shopping_cart).setOnClickListener {
            lateinit var fragment: Fragment
            fragment = ShoppingCartFragment()

            supportFragmentManager.beginTransaction()
                    .replace(R.id.nav_host_fragment, fragment)
                    .commit()
            this.drawer.closeDrawer(GravityCompat.START)
        }

    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getAllBrands()
        getAllCategories()
        getAllVendors()
        setContentView(R.layout.activity_home_page)
        setAppBar()
        setExpandableSideMenu()
        setSearchFunction()
    }
    private fun getAllVendors(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllVendors().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }


            override fun onResponse(
                    p0: Call<List<String>>?,
                    response: Response<List<String>>?
            ) {
                if (response != null) {
                    allVendors = response.body()!!
                }

            }

        })
    }
    private fun getAllBrands(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllBrands().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<String>>?,
                    response: Response<List<String>>?
            ) {
                if (response != null) {
                    allBrands = response.body()!!
                }

            }

        })
    }
    private fun getAllCategories(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getAllCategories().enqueue(object : retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<String>>?,
                    response: Response<List<String>>?
            ) {
                if (response != null) {
                    allCategories = response.body()!!
                }

            }

        })
    }
    override fun onBackPressed() {
        val count = fragmentManager.backStackEntryCount
        if (count == 0) {
            super.onBackPressed()
        } else {
            fragmentManager.popBackStack()
        }
    }
    fun setVendorRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupVendors)
        for(vendor in allVendors){
            val btn1 = RadioButton(this)
            btn1.text = vendor
            radioGroup.addView(btn1)
        }
    }
    fun setBrandRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupBrands)
        for(brand in allBrands){
            val btn1 = RadioButton(this)
            btn1.text = brand
            radioGroup.addView(btn1)
        }
    }
    fun setCategoryRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupCategory)
        for(cat in allCategories){
            val btn1 = RadioButton(this)
            btn1.text = cat
            radioGroup.addView(btn1)
        }
    }
    fun setRatingRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupRating)
        val btn1 = RadioButton(this)
        btn1.text = "1+"
        val btn2 = RadioButton(this)
        btn2.text = "2+"
        val btn3 = RadioButton(this)
        btn3.text = "3+"
        val btn4 = RadioButton(this)
        btn4.text = "4+"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
        radioGroup.addView(btn4)
    }
    private fun displayStandardFragment(id: Int){
        lateinit var fragment: Fragment
        if(id == R.id.nav_account){
            fragment = AccountFragment()
        }
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    private fun displayFragment(id: Int, type: Int, keys: String, filters: HashMap<String, String>?){
        lateinit var fragment: Fragment
        if(id == R.id.nav_home){
            fragment = HomeFragment()
        }

        val bundle = Bundle()
        bundle.putInt("type", type)
        bundle.putString("keys", keys)
        if(filters!=null){
            bundle.putSerializable("filters", filters)
        }
        fragment.arguments = bundle
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    /*
     * Preparing the list data
     */
    private fun prepareListData() {
        listDataHeader = ArrayList()
        listDataChild = HashMap()

        // Adding child data
        (listDataHeader as ArrayList<String>).add("My Account")

        (listDataHeader as ArrayList<String>).add("Home")

        (listDataHeader as ArrayList<String>).add("Categories")

        // Adding child data
        val categoryNames: MutableList<String> = ArrayList()

        categoryNames.add("Electronics")
        categoryNames.add("Fashion")
        categoryNames.add("Home")
        categoryNames.add("Cosmetics")
        categoryNames.add("Sports")
        listDataChild!![(listDataHeader as ArrayList<String>)[0]] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>)[1]] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>)[2]] = categoryNames
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }
}