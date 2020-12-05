package com.example.tursuapp.authentication.homepage

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.authentication.ExpandableListAdapter
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.google.android.material.navigation.NavigationView

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
    private lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle

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
    private fun setExpandableSideMenu(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener { _, _, groupPosition, id ->
            when (groupPosition) {
                0 -> displayFragment(R.id.nav_home, 0, "")
            }
            false
        }
        expListView!!.setOnChildClickListener(ExpandableListView.OnChildClickListener { parent, v, groupPosition, childPosition, id ->
            // Kategoriye basılınca olacakları ayarla
            if (groupPosition == 1) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics")
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion")
                    2 -> displayFragment(R.id.nav_home, 1, "Home")
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics")
                    4 -> displayFragment(R.id.nav_home, 1, "Sports")
                }
            }

            false
        })
        expListView!!.setSelectedGroup(0)
    }
    private fun setFilterFunction(){
        val filter = findViewById<ImageView>(R.id.filter_image)
        filter.setOnClickListener {
            showPopupWindow(it)
        }
    }
    private fun setSearchFunction(){
        this.findViewById<Button>(R.id.search_button).setOnClickListener {
            val editText: EditText? = findViewById(R.id.editMobileNo)

            if (editText != null) {
                val searchText=editText.text
                displayFragment(R.id.nav_home, 2, searchText.toString())
                //search(searchText.toString())
            }
            editText?.text?.clear()
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)
        setAppBar()
        setExpandableSideMenu()
        setSearchFunction()
        setFilterFunction()
    }
    override fun onBackPressed() {
        val count = fragmentManager.backStackEntryCount
        if (count == 0) {
            super.onBackPressed()
        } else {
            fragmentManager.popBackStack()
        }
    }
    private fun setVendorRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupVendors)
        val btn1 = RadioButton(this)
        btn1.text = "vendor 1"
        radioGroup.addView(btn1)
        val btn2 = RadioButton(this)
        btn2.text = "vendor 2"
        radioGroup.addView(btn2)
        val btn3 = RadioButton(this)
        btn3.text = "vendor 3"
        radioGroup.addView(btn3)

    }
    private fun setBrandRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupBrands)
        val btn1 = RadioButton(this)
        btn1.text = "brand 1"
        val btn2 = RadioButton(this)
        btn2.text = "brand 2"
        val btn3 = RadioButton(this)
        btn3.text = "brand 3"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
    }
    private fun setCategoryRadioButtons(view: View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupCategory)
        val btn1 = RadioButton(this)
        btn1.text = "category 1"
        val btn2 = RadioButton(this)
        btn2.text = "category 2"
        val btn3 = RadioButton(this)
        btn3.text = "category 3"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
    }
    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.filter_popup_layout, null)
        setVendorRadioButtons(popupView)
        setBrandRadioButtons(popupView)
        setCategoryRadioButtons(popupView)
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
        val filters = mutableMapOf<String,String>()
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
        Log.i("FilterActivity",filters.toString())
    }
    private fun displayFragment(id: Int, type: Int, keys: String){
        lateinit var fragment: Fragment
        if(id==R.id.nav_home){
            fragment = HomeFragment()
        }
        val bundle = Bundle()
        bundle.putInt("type", type)
        bundle.putString("keys", keys)
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
        listDataChild!![(listDataHeader as ArrayList<String>)[1]] = categoryNames
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }
}