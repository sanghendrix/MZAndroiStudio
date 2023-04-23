package com.rpgmaker.game

import android.widget.TextView
import java.net.URL
import java.io.BufferedInputStream
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.*
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.InputType
import android.view.*
import android.webkit.*
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.anjlab.android.iab.v3.BillingProcessor
import com.anjlab.android.iab.v3.TransactionDetails
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.gms.ads.rewarded.ServerSideVerificationOptions
import com.google.android.play.core.review.ReviewManagerFactory
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.util.Log
import com.google.firebase.storage.FirebaseStorage
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipInputStream


class MainActivity : AppCompatActivity(), BillingProcessor.IBillingHandler {

    private lateinit var loadingTextView: TextView
    private lateinit var rpgwebview: WebView
    private lateinit var adView: AdView
    private var mInterstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null

    lateinit var bp: BillingProcessor
    private var mainact = this@MainActivity
    private lateinit var adReadyButton: ImageView


    override fun onBillingInitialized() {
    }

    override fun onPurchaseHistoryRestored() {
    }

    override fun onProductPurchased(productId: String, details: TransactionDetails?) {
        rpgwebview.evaluateJavascript("javascript:BillingSuccess('$productId')") {
        }
    }

    override fun onBillingError(errorCode: Int, error: Throwable?) {
        if (errorCode == 0) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('OK')") {
            }
        }
        if (errorCode == 1) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('USER_CANCELED')") {
            }
        }
        if (errorCode == 2) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('SERVICE_UNAVAILABLE')") {
            }
        }
        if (errorCode == 3) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('BILLING_UNAVAILABLE')") {
            }
        }
        if (errorCode == 4) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('ITEM_UNAVAILABLE')") {
            }
        }
        if (errorCode == 5) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('DEVELOPER_ERROR')") {
            }
        }
        if (errorCode == 6) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('ERROR')") {
            }
        }
        if (errorCode == 7) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('ITEM_ALREADY_OWNED')") {
            }
        }
        if (errorCode == 8) {
            rpgwebview.evaluateJavascript("javascript:BillingFail('ITEM_NOT_OWNED')") {
            }
        }
    }


    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.activity_main)
        loadingTextView = findViewById(R.id.loading_text_view)
        rpgwebview = findViewById(R.id.webView) // Thêm dòng này
        adView = findViewById(R.id.adView)
        val storage = FirebaseStorage.getInstance()
        val gcsPath = "gs://into-samomor.appspot.com/IntoSamomor.zip"
        val storageReference = storage.getReferenceFromUrl(gcsPath)
        storageReference.downloadUrl.addOnSuccessListener { downloadUrl ->
            downloadAndUnzipFile(downloadUrl) {
                setupWebViewAndAds()
            }
        }.addOnFailureListener { exception ->
            Log.e("MainActivity", "Failed to get download URL", exception)
        }
    }

        private fun setupWebViewAndAds() {
            adReadyButton = findViewById(R.id.ad_ready_button)
            @Suppress("DEPRECATION")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                window.insetsController?.hide(WindowInsets.Type.statusBars())
            } else {
                window.setFlags(
                    WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN
                )
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val insetsController = window.insetsController
                if (insetsController != null) {
                    insetsController.hide(WindowInsets.Type.navigationBars())
                    insetsController.systemBarsBehavior =
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                }
            } else {
                // Hide the navigation bar for API level 30 and below
                window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
            }

            bp = BillingProcessor(mainact, getString(R.string.license_key), this)
            bp.initialize()
            setWebView()
            adView.pause()
            adView.visibility = View.GONE
            val adRequest = AdRequest.Builder().build()
            adView.loadAd(adRequest)
            loadInterstitialAd()
            loadRewardedAd()
        }

    private fun updateLoadingText(progress: Int) {
        loadingTextView.visibility = View.VISIBLE
        loadingTextView.text = "Loading: $progress%"
    }

    private fun downloadAndUnzipFile(downloadUrl: Uri, onFinish: () -> Unit) {
        Thread {
            try {
                val url = URL(downloadUrl.toString())
                val connection = url.openConnection()
                val totalSize = connection.contentLength
                val zipInputStream = ZipInputStream(BufferedInputStream(url.openStream()))
                val outputDir = filesDir

                var bytesRead = 0
                var zipEntry = zipInputStream.nextEntry
                while (zipEntry != null) {
                    val outputFile = File(outputDir, zipEntry.name)
                    if (zipEntry.isDirectory) {
                        outputFile.mkdirs()
                    } else {
                        outputFile.parentFile?.mkdirs()

                        FileOutputStream(outputFile).use { fileOutputStream ->
                            val buffer = ByteArray(1024)
                            var count = zipInputStream.read(buffer)
                            while (count != -1) {
                                fileOutputStream.write(buffer, 0, count)
                                bytesRead += count
                                val progress = (bytesRead.toFloat() / totalSize.toFloat() * 100).toInt()
                                runOnUiThread { updateLoadingText(progress) }
                                count = zipInputStream.read(buffer)
                            }
                        }
                    }
                    zipInputStream.closeEntry()
                    zipEntry = zipInputStream.nextEntry
                }
                zipInputStream.close()
                runOnUiThread {
                    loadingTextView.visibility = View.GONE
                    onFinish()
                }
            } catch (exception: Exception) {
                Log.e("MainActivity", "Failed to download and unzip file", exception)
            }
        }.start()
    }


    @Suppress("DEPRECATION")
    private fun isNetworkAvailable(context: Context): Boolean {
        var result = false
        val cm = context.getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager?
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            cm?.run {
                cm.getNetworkCapabilities(cm.activeNetwork)?.run {
                    result = when {
                        hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
                        hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
                        hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
                        else -> false
                    }
                }
            }
        } else {
            cm?.run {
                cm.activeNetworkInfo?.run {
                    if (type == ConnectivityManager.TYPE_WIFI) {
                        result = true
                    } else if (type == ConnectivityManager.TYPE_MOBILE) {
                        result = true
                    }
                }
            }
        }
        return result
    }

    private fun loadInterstitialAd() {
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            mainact,
            getString(R.string.interstitial_ad_unit_id),
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    mInterstitialAd = null
                }

                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    mInterstitialAd = interstitialAd
                }
            })
        mInterstitialAd?.fullScreenContentCallback =
            object : FullScreenContentCallback() {
                override fun onAdClicked() {

                }

                override fun onAdDismissedFullScreenContent() {
                    // Called when ad is dismissed.
                    mInterstitialAd = null
                }

                override fun onAdFailedToShowFullScreenContent(p0: AdError) {
                    // Called when ad fails to show.
                    mInterstitialAd = null
                }

                override fun onAdImpression() {
                    // Called when an impression is recorded for an ad.

                }

                override fun onAdShowedFullScreenContent() {
                    // Called when ad is shown.

                }
            }

    }


    private fun loadRewardedAd() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(
            mainact,
            getString(R.string.rewarded_Ad_unit_id),
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                        // Lặp lại lệnh gọi quảng cáo sau 25 giây
                        //Toast.makeText(mainact, "Start Loading Ads", Toast.LENGTH_SHORT).show()
                        Handler(Looper.getMainLooper()).postDelayed({
                            loadRewardedAd()
                        }, 25000)
                }

                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    adReadyButton.visibility = View.VISIBLE
                    val options = ServerSideVerificationOptions.Builder()
                        .setCustomData("SAMPLE_CUSTOM_DATA_STRING")
                        .build()
                    rewardedAd!!.setServerSideVerificationOptions(options)
                }
            })
        rewardedAd?.fullScreenContentCallback =
            object : FullScreenContentCallback() {
                override fun onAdClicked() {
                    // Called when a click is recorded for an ad.
                }

                override fun onAdDismissedFullScreenContent() {
                    // Called when ad is dismissed.
                    // Set the ad reference to null so you don't show the ad a second time.
                    rewardedAd = null
                }

                override fun onAdFailedToShowFullScreenContent(p0: AdError) {
                    // Called when ad fails to show.
                    rewardedAd = null
                }

                override fun onAdImpression() {
                    // Called when an impression is recorded for an ad.

                }

                override fun onAdShowedFullScreenContent() {
                    // Called when ad is shown.
                    adReadyButton.visibility = View.GONE

                }
            }
    }

    @SuppressLint("SetJavaScriptEnabled")
    var setWebView = {

        val webSettings = rpgwebview.settings
        webSettings.allowFileAccess = true
        webSettings.allowContentAccess = true
        webSettings.domStorageEnabled = true
        webSettings.mediaPlaybackRequiresUserGesture = false
        webSettings.useWideViewPort = true
        webSettings.databaseEnabled = true
        webSettings.loadWithOverviewMode = true
        webSettings.defaultTextEncodingName = "utf-8"
        webSettings.javaScriptCanOpenWindowsAutomatically = true
        webSettings.loadsImagesAutomatically = true
        webSettings.javaScriptEnabled = true
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        if (getString(R.string.test_mode) != "true") {
            if (!verifyInstallerId(applicationContext)) {
                Toast.makeText(
                    applicationContext,
                    getString(R.string.is_gdd_msg),
                    Toast.LENGTH_SHORT
                ).show()
                finish()
            }
        }

        rpgwebview.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("example.com") // replace this with your website's domain
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this)).build()
        rpgwebview.webViewClient = LocalContentWebViewClient(assetLoader)
        rpgwebview.webChromeClient = WebChromeClient()
        val inAppHtmlUrl = "https://example.com/assets/index.html"
        rpgwebview.loadUrl(inAppHtmlUrl)


    }


    inner class LocalContentWebViewClient(private val assetLoader: WebViewAssetLoader) :
        WebViewClientCompat() {
        override fun shouldInterceptRequest(
            view: WebView, request: WebResourceRequest
        ): WebResourceResponse? {
            return assetLoader.shouldInterceptRequest(request.url)
        }

        override fun shouldOverrideUrlLoading(
            view: WebView,
            requests: WebResourceRequest
        ): Boolean {
            val uri = Uri.parse(requests.url.toString())
            if (uri.scheme == "iap") {
                if (uri.authority == "rpgmaker") {
                    if (uri.getQueryParameter("action") == "Purchase") {
                        if (isNetworkAvailable(mainact)) {
                            bp.purchase(mainact, uri.getQueryParameter("productId"))
                        }
                    }

                    if (uri.getQueryParameter("action") == "consumePurchase") {
                        if (isNetworkAvailable(mainact)) {
                            bp.consumePurchase(uri.getQueryParameter("productId"))
                            bp.purchase(mainact, uri.getQueryParameter("productId"))
                        }
                    }
                    if (uri.getQueryParameter("action") == "Subscriptions") {
                        if (isNetworkAvailable(mainact)) {
                            bp.subscribe(mainact, uri.getQueryParameter("productId"))
                        }
                    }
                    if (uri.getQueryParameter("action") == "GetPurchase") {
                        if (isNetworkAvailable(mainact)) {
                            val sku =
                                bp.getPurchaseListingDetails(uri.getQueryParameter("productId"))
                            rpgwebview.evaluateJavascript(
                                "javascript:BillingGetPurchase('" + uri.getQueryParameter(
                                    "productId"
                                ) + "','" + sku.priceValue + "','" + sku.currency + "')"
                            ) {
                            }
                        }
                    }

                    if (uri.getQueryParameter("action") == "GetConPurchase") {
                        if (isNetworkAvailable(mainact)) {
                            val sku =
                                bp.getPurchaseListingDetails(uri.getQueryParameter("productId"))
                            rpgwebview.evaluateJavascript(
                                "javascript:BillingGetConPurchase('" + uri.getQueryParameter(
                                    "productId"
                                ) + "','" + sku.priceValue + "','" + sku.currency + "')"
                            ) {
                            }
                        }
                    }

                    if (uri.getQueryParameter("action") == "GetSubscriptions") {
                        if (isNetworkAvailable(mainact)) {
                            val sku =
                                bp.getSubscriptionListingDetails(uri.getQueryParameter("productId"))
                            rpgwebview.evaluateJavascript(
                                "javascript:BillingGetSubscriptions('" + uri.getQueryParameter(
                                    "productId"
                                ) + "','" + sku.priceValue + "','" + sku.currency + "')"
                            ) {
                            }
                        }
                    }

                    if (uri.getQueryParameter("action") == "Restore") {
                        if (isNetworkAvailable(mainact)) {
                            bp.loadOwnedPurchasesFromGoogle()
                            if (bp.isPurchased(uri.getQueryParameter("productId"))) {
                                rpgwebview.evaluateJavascript(
                                    "javascript:RestorePurchase('" + uri.getQueryParameter(
                                        "productId"
                                    ) + "')"
                                ) {
                                }
                            }
                        }
                    }
                    if (uri.getQueryParameter("action") == "Restore_Sub") {
                        if (isNetworkAvailable(mainact)) {
                            bp.loadOwnedPurchasesFromGoogle()
                            val subscriptionTransactionDetails =
                                bp.getSubscriptionTransactionDetails(uri.getQueryParameter("productId"))
                            if (subscriptionTransactionDetails != null) {
                                rpgwebview.evaluateJavascript(
                                    "javascript:BillingSubscription('" + uri.getQueryParameter(
                                        "productId"
                                    ) + "','" + true + "')"
                                ) {
                                }
                            } else {
                                rpgwebview.evaluateJavascript(
                                    "javascript:BillingSubscription('" + uri.getQueryParameter(
                                        "productId"
                                    ) + "','" + false + "')"
                                ) {
                                }
                            }
                        }
                    }

                }
                return true
            }
            if (uri.scheme == "inapp") {
                if (uri.authority == "rpgmaker") {
                    if (uri.getQueryParameter("action") == "edittext") {
                        showEditDialog(
                            uri.getQueryParameter("title"),
                            uri.getQueryParameter("msg"),
                            uri.getQueryParameter("varld")
                        )
                    }
                    if (uri.getQueryParameter("action") == "exit") {
                        finish()
                    }
                    if (uri.getQueryParameter("action") == "review") {
                        val reviewManager = ReviewManagerFactory.create(this@MainActivity)
                        val requestReviewFlow = reviewManager.requestReviewFlow()
                        requestReviewFlow.addOnCompleteListener { request ->
                            if (request.isSuccessful) {

                                val reviewInfo = request.result
                                val flow =
                                    reviewManager.launchReviewFlow(this@MainActivity, reviewInfo)
                                flow.addOnCompleteListener {
                                }
                            }
                        }
                    }
                    if (uri.getQueryParameter("action") == "link") {
                        val urls = uri.getQueryParameter("urlargs")
                        try {
                            val i = Intent("android.intent.action.MAIN")
                            i.component =
                                ComponentName.unflattenFromString("com.android.chrome/com.android.chrome.Main")
                            i.addCategory("android.intent.category.LAUNCHER")
                            i.data = Uri.parse(urls)
                            startActivity(i)
                        } catch (e: ActivityNotFoundException) {
                            // Chrome is not installed
                            val i = Intent(Intent.ACTION_VIEW, Uri.parse(urls))
                            startActivity(i)
                        }
                    }
                    //Blocking Capture
                    if (uri.getQueryParameter("action") == "capture") {
                        if (uri.getQueryParameter("state") == "true") {
                            window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                        } else {
                            window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                        }
                    }
                }

                return true
            }
            if (uri.scheme == "admob") {
                if (uri.authority == "rpgmaker") {
                    if (uri.getQueryParameter("action") == "callBannerAd") {
                        if (isNetworkAvailable(mainact)) {
                            if (uri.getQueryParameter("state") == "true") {
                                adView.resume()
                                adView.visibility = View.VISIBLE
                            } else {
                                adView.pause()
                                adView.visibility = View.GONE
                            }
                        }
                    }

                    if (uri.getQueryParameter("action") == "callIntAd") {
                        if (isNetworkAvailable(mainact)) {

                            if (mInterstitialAd != null) {

                                mInterstitialAd?.show(mainact)
                            }

                        }

                    }
                    if (uri.getQueryParameter("action") == "callNativeAd") {
                        if (isNetworkAvailable(mainact)) {
                            return false
                        }
                    }
                    if (uri.getQueryParameter("action") == "callRewardInterAd") {
                        if (isNetworkAvailable(mainact)) {
                            rewardedAd?.let { ad ->
                                ad.show(mainact) {
                                    rpgwebview.evaluateJavascript(
                                        "javascript:RewardInterAd('" + uri.getQueryParameter(
                                            "rewardId"
                                        ) + "')"
                                    ) {

                                    }

                                }
                            } ?: run {

                            }

                        }
                    }
                }
                return true
            }
            return super.shouldOverrideUrlLoading(view, requests)
        }
    }


    private fun showEditDialog(TextTitle: String?, TextMsg: String?, VarId: String?) {

        val builder: AlertDialog.Builder = AlertDialog.Builder(this)
        builder.setTitle(TextTitle)
        builder.setCancelable(false)
        val input = EditText(this)
        input.hint = TextMsg
        input.inputType = InputType.TYPE_CLASS_TEXT
        builder.setView(input)
        rpgwebview.onPause()
        builder.setPositiveButton(getString(R.string.are_you_Ok)) { _, _ ->
            val edittext = input.text.toString()
            rpgwebview.evaluateJavascript(
                "javascript:Showeditdialog('$edittext','$VarId')"
            ) {
            }
            rpgwebview.onResume()
        }
        builder.setNegativeButton(getString(R.string.are_you_Cancel)) { dialog, _ ->

            rpgwebview.evaluateJavascript(
                "javascript:Showeditdialog(0,'$VarId')"
            ) {
            }
            rpgwebview.onResume()
            dialog.cancel()
        }
        builder.show()
    }

    @Suppress("DEPRECATION")
    private fun verifyInstallerId(context: Context): Boolean {
        // A list with valid installers package name
        val validInstallers: List<String> =
            ArrayList(listOf("com.android.vending", "com.google.android.feedback"))
        // The package name of the app that has installed your app
        val installer: String? = context.packageManager.getInstallerPackageName(context.packageName)
        // true if your app has been downloaded from Play Store
        return installer != null && validInstallers.contains(installer)
    }


    override fun onDestroy() {

        rpgwebview.loadDataWithBaseURL(null, "", "text/html", "utf-8", null)
        rpgwebview.clearHistory()
        rpgwebview.destroy()
        adView.destroy()
        super.onDestroy()
    }

    override fun onPause() {
        rpgwebview.onPause()
        adView.pause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        rpgwebview.onResume()
        adView.resume()
        loadInterstitialAd()
        loadRewardedAd()
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            rpgwebview.onPause()
            val builder = AlertDialog.Builder(this)
            builder.setTitle(getString(R.string.are_you_exit_title))
            builder.setCancelable(false)
            builder.setMessage(getString(R.string.are_you_exit_msg))
                .setPositiveButton(
                    getString(R.string.are_you_exit_yes)
                ) { _, _ ->
                    finish()
                }
                .setNegativeButton(
                    getString(R.string.are_you_exit_no)
                ) { dialog, _ ->
                    rpgwebview.onResume()
                    dialog.cancel()
                }
            // Create the AlertDialog object and return it
            val alert = builder.create()
            alert.show()
            return false
        }
        return super.onKeyDown(keyCode, event)
    }


}
