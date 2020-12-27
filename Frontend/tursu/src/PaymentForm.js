import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);



export default function PaymentForm(props) {
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen2 = () => {
        setOpen2(true);
    };
    const handleClose2 = () => {
        setOpen2(false);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField required id="cardName" label="Name on card" fullWidth autoComplete="cc-name" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        type="number"
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        onChange={(e)=>
                            props.setCardNumber(e.target.value)
                        }
                        value={props.cardNumber}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            required
                            type="number"
                            id="month"
                            label="Month"
                            fullWidth
                            onChange={(e)=>
                                props.setExpMonth(e.target.value)
                            }
                            value={props.expMonth}
                             />
                        <div style={{ marginTop: '25px' }}>/</div>
                        <TextField
                            required
                            type="number"
                            id="year"
                            label="Year"
                            fullWidth
                            onChange={(e)=>
                                props.setExpYear(e.target.value)
                            }
                            value={props.expYear}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        type="number"
                        id="cvv"
                        label="CVV"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                        onChange={(e)=>
                            props.setCvc(e.target.value)
                        }
                        value={props.cvc}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Distance Sale Contract
                        </Button>

                        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                Distance Sale Contract
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    Gümrük ve Ticaret Bakanlığından:

                                    MESAFELİ SÖZLEŞMELER YÖNETMELİĞİ

                                    BİRİNCİ BÖLÜM

                                    Amaç, Kapsam, Dayanak ve Tanımlar

                                    Amaç

                                    MADDE 1 – (1) Bu Yönetmeliğin amacı, mesafeli sözleşmelere ilişkin uygulama usul ve esaslarını düzenlemektir.

                                    Kapsam

                                    MADDE 2 – (1) Bu Yönetmelik, mesafeli sözleşmelere uygulanır.

                                    (2) Bu Yönetmelik hükümleri;

                                    a) Finansal hizmetler,

                                    b) Otomatik makineler aracılığıyla yapılan satışlar,

                                    c) Halka açık telefon vasıtasıyla telekomünikasyon operatörleriyle bu telefonun kullanımı,

                                    ç) Bahis, çekiliş, piyango ve benzeri şans oyunlarına ilişkin hizmetler,

                                    d) Taşınmaz malların veya bu mallara ilişkin hakların oluşumu, devri veya kazanımı,

                                    e) Konut kiralama,

                                    f) Paket turlar,

                                    g) Devre mülk, devre tatil, uzun süreli tatil hizmeti ve bunların yeniden satımı veya değişimi,

                                    ğ) Yiyecek ve içecekler gibi günlük tüketim maddelerinin, satıcının düzenli teslimatları çerçevesinde tüketicinin meskenine veya işyerine götürülmesi,

                                    h) 5 inci maddenin birinci fıkrasının (a), (b) ve (d) bentlerindeki bilgi verme yükümlülüğü ile 18 inci ve 19 uncu maddelerde yer alan yükümlülükler saklı kalmak koşuluyla yolcu taşıma hizmetleri,

                                    ı) Malların montaj, bakım ve onarımı,

                                    i) Bakımevi hizmetleri, çocuk, yaşlı ya da hasta bakımı gibi ailelerin ve kişilerin desteklenmesine yönelik sosyal hizmetler

                                    ile ilgili sözleşmelere uygulanmaz.

                                    Dayanak

                                    MADDE 3 – (1) Bu Yönetmelik, 7/11/2013 tarihli ve 6502 sayılı Tüketicinin Korunması Hakkında Kanunun 48 inci ve 84 üncü maddelerine dayanılarak hazırlanmıştır.

                                    Tanımlar

                                    MADDE 4 – (1) Bu Yönetmeliğin uygulanmasında;

                                    a) Dijital içerik: Bilgisayar programı, uygulama, oyun, müzik, video ve metin gibi dijital şekilde sunulan her türlü veriyi,

                                    b) Hizmet: Bir ücret veya menfaat karşılığında yapılan ya da yapılması taahhüt edilen mal sağlama dışındaki her türlü tüketici işleminin konusunu,

                                    c) Kalıcı veri saklayıcısı: Tüketicinin gönderdiği veya kendisine gönderilen bilgiyi, bu bilginin amacına uygun olarak makul bir süre incelemesine elverecek şekilde kaydedilmesini ve değiştirilmeden kopyalanmasını sağlayan ve bu bilgiye aynen ulaşılmasına imkan veren kısa mesaj, elektronik posta, internet, disk, CD, DVD, hafıza kartı ve benzeri her türlü araç veya ortamı,

                                    ç) Kanun: 6502 sayılı Tüketicinin Korunması Hakkında Kanunu,

                                    d) Mal: Alışverişe konu olan; taşınır eşya, konut veya tatil amaçlı taşınmaz mallar ile elektronik ortamda kullanılmak üzere hazırlanan yazılım, ses, görüntü ve benzeri her türlü gayri maddi malları,

                                    e) Mesafeli sözleşme: Satıcı veya sağlayıcı ile tüketicinin eş zamanlı fiziksel varlığı olmaksızın, mal veya hizmetlerin uzaktan pazarlanmasına yönelik olarak oluşturulmuş bir sistem çerçevesinde, taraflar arasında sözleşmenin kurulduğu ana kadar ve kurulduğu an da dahil olmak üzere uzaktan iletişim araçlarının kullanılması suretiyle kurulan sözleşmeleri,

                                    f) Sağlayıcı: Kamu tüzel kişileri de dahil olmak üzere ticari veya mesleki amaçlarla tüketiciye hizmet sunan ya da hizmet sunanın adına ya da hesabına hareket eden gerçek veya tüzel kişiyi,

                                    g) Satıcı: Kamu tüzel kişileri de dahil olmak üzere ticari veya mesleki amaçlarla tüketiciye mal sunan ya da mal sunanın adına ya da hesabına hareket eden gerçek veya tüzel kişiyi,

                                    ğ) Tüketici: Ticari veya mesleki olmayan amaçlarla hareket eden gerçek veya tüzel kişiyi,

                                    h) Uzaktan iletişim aracı: Mektup, katalog, telefon, faks, radyo, televizyon, elektronik posta mesajı, kısa mesaj, internet gibi fiziksel olarak karşı karşıya gelinmeksizin sözleşme kurulmasına imkan veren her türlü araç veya ortamı,

                                    ı) Yan sözleşme: Bir mesafeli sözleşme ile ilişkili olarak satıcı, sağlayıcı ya da üçüncü bir kişi tarafından sözleşme konusu mal ya da hizmete ilave olarak tüketiciye sağlanan mal veya hizmete ilişkin sözleşmeyi

                                    ifade eder.

                                    İKİNCİ BÖLÜM

                                    Ön Bilgilendirme Yükümlülüğü

                                    Ön bilgilendirme

                                    MADDE 5 – (1) Tüketici, mesafeli sözleşmenin kurulmasından ya da buna karşılık gelen herhangi bir teklifi kabul etmeden önce, aşağıdaki hususların tamamını içerecek şekilde satıcı veya sağlayıcı tarafından bilgilendirilmek zorundadır.

                                    a) Sözleşme konusu mal veya hizmetin temel nitelikleri,

                                    b) Satıcı veya sağlayıcının adı veya unvanı, varsa MERSİS numarası,

                                    c) Tüketicinin satıcı veya sağlayıcı ile hızlı bir şekilde irtibat kurmasına imkan veren, satıcı veya sağlayıcının açık adresi, telefon numarası ve benzeri iletişim bilgileri ile varsa satıcı veya sağlayıcının adına ya da hesabına hareket edenin kimliği ve adresi,

                                    ç) Satıcı veya sağlayıcının tüketicinin şikayetlerini iletmesi için (c) bendinde belirtilenden farklı iletişim bilgileri var ise, bunlara ilişkin bilgi,

                                    d) Mal veya hizmetin tüm vergiler dahil toplam fiyatı, niteliği itibariyle önceden hesaplanamıyorsa fiyatın hesaplanma usulü, varsa tüm nakliye, teslim ve benzeri ek masraflar ile bunların önceden hesaplanamaması halinde ek masrafların ödenebileceği bilgisi,

                                    e) Sözleşmenin kurulması aşamasında uzaktan iletişim aracının kullanım bedelinin olağan ücret tarifesi üzerinden hesaplanamadığı durumlarda, tüketicilere yüklenen ilave maliyet,

                                    f) Ödeme, teslimat, ifaya ilişkin bilgiler ile varsa bunlara ilişkin taahhütler ve satıcı veya sağlayıcının şikayetlere ilişkin çözüm yöntemleri,

                                    g) Cayma hakkının olduğu durumlarda, bu hakkın kullanılma şartları, süresi, usulü ve satıcının iade için öngördüğü taşıyıcıya ilişkin bilgiler,

                                    ğ) Cayma bildiriminin yapılacağı açık adres, faks numarası veya elektronik posta bilgileri,

                                    h) 15 inci madde uyarınca cayma hakkının kullanılamadığı durumlarda, tüketicinin cayma hakkından faydalanamayacağına ya da hangi koşullarda cayma hakkını kaybedeceğine ilişkin bilgi,

                                    ı) Satıcı veya sağlayıcının talebi üzerine, varsa tüketici tarafından ödenmesi veya sağlanması gereken depozitolar ya da diğer mali teminatlar ve bunlara ilişkin şartlar,

                                    i) Varsa dijital içeriklerin işlevselliğini etkileyebilecek teknik koruma önlemleri,

                                    j) Satıcı veya sağlayıcının bildiği ya da makul olarak bilmesinin beklendiği, dijital içeriğin hangi donanım ya da yazılımla birlikte çalışabileceğine ilişkin bilgi,

                                    k) Tüketicilerin uyuşmazlık konusundaki başvurularını Tüketici Mahkemesine veya Tüketici Hakem Heyetine yapabileceklerine dair bilgi.

                                    (2) Birinci fıkrada belirtilen bilgiler, mesafeli sözleşmenin ayrılmaz bir parçasıdır ve taraflar aksini açıkça kararlaştırmadıkça bu bilgiler değiştirilemez.

                                    (3) Satıcı veya sağlayıcı, birinci fıkranın (d) bendinde yer alan ek masraflara ilişkin bilgilendirme yükümlülüğünü yerine getirmezse, tüketici bunları karşılamakla yükümlü değildir.

                                    (4) Birinci fıkranın (d) bendinde yer alan toplam fiyatın, belirsiz süreli sözleşmelerde veya belirli süreli abonelik sözleşmelerinde, her faturalama dönemi bazında toplam masrafları içermesi zorunludur.

                                    (5) Açık artırma veya eksiltme yoluyla kurulan sözleşmelerde, birinci fıkranın (b), (c) ve (ç) bentlerinde yer alan bilgilerin yerine açık artırmayı yapan ile ilgili bilgilere yer verilebilir.

                                    (6) Ön bilgilendirme yapıldığına ilişkin ispat yükü satıcı veya sağlayıcıya aittir.

                                    Ön bilgilendirme yöntemi

                                    MADDE 6 – (1) Tüketici, 5 inci maddenin birinci fıkrasında belirtilen tüm hususlarda, kullanılan uzaktan iletişim aracına uygun olarak en az on iki punto büyüklüğünde, anlaşılabilir bir dilde, açık, sade ve okunabilir bir şekilde satıcı veya sağlayıcı tarafından yazılı olarak veya kalıcı veri saklayıcısı ile bilgilendirilmek zorundadır.

                                    (2) Mesafeli sözleşmenin internet yoluyla kurulması halinde, satıcı veya sağlayıcı;

                                    a) 5 inci maddenin birinci fıkrasında yer alan bilgilendirme yükümlülüğü saklı kalmak kaydıyla, aynı fıkranın (a), (d), (g) ve (h) bentlerinde yer alan bilgileri bir bütün olarak, tüketicinin ödeme yükümlülüğü altına girmesinden hemen önce açık bir şekilde ayrıca göstermek,

                                    b) Herhangi bir gönderim kısıtlamasının uygulanıp uygulanmadığını ve hangi ödeme araçlarının kabul edildiğini, en geç tüketici siparişini vermeden önce, açık ve anlaşılabilir bir şekilde belirtmek

                                    zorundadır.

                                    (3) Mesafeli sözleşmenin sesli iletişim yoluyla kurulması halinde, satıcı veya sağlayıcı 5 inci maddenin birinci fıkrasının (a), (d), (g) ve (h) bentlerinde yer alan hususlarda, tüketiciyi sipariş vermeden hemen önce açık ve anlaşılır bir şekilde söz konusu ortamda bilgilendirmek ve 5 inci maddenin birinci fıkrasında yer alan bilgilerin tamamını en geç mal teslimine veya hizmet ifasına kadar yazılı olarak göndermek zorundadır.

                                    (4) Siparişe ilişkin bilgilerin sınırlı alanda ya da zamanda sunulduğu bir ortam yoluyla mesafeli sözleşmenin kurulması halinde, satıcı veya sağlayıcı 5 inci maddenin birinci fıkrasının (a), (b), (d), (g) ve (h) bentlerinde yer alan hususlarda, tüketiciyi sipariş vermeden hemen önce açık ve anlaşılabilir bir şekilde söz konusu ortamda bilgilendirmek ve 5 inci maddenin birinci fıkrasında yer alan bilgilerin tamamını en geç mal teslimine veya hizmet ifasına kadar yazılı olarak göndermek zorundadır.

                                    (5) Üçüncü ve dördüncü fıkralarda belirtilen yöntemlerle kurulan ve anında ifa edilen hizmet satışlarına ilişkin sözleşmelerde tüketicinin, sipariş vermeden hemen önce söz konusu ortamda 5 inci maddenin birinci fıkrasının sadece (a), (b), (d) ve (h) bentlerinde yer alan hususlarda açık ve anlaşılır bir şekilde bilgilendirilmesi yeterlidir.

                                    Ön bilgilerin teyidi

                                    MADDE 7 – (1) Satıcı veya sağlayıcı, tüketicinin 6 ncı maddede belirtilen yöntemlerle ön bilgileri edindiğini kullanılan uzaktan iletişim aracına uygun olarak teyit etmesini sağlamak zorundadır. Aksi halde sözleşme kurulmamış sayılır.

                                    Ön bilgilendirmeye ilişkin diğer yükümlülükler

                                    MADDE 8 – (1) Satıcı veya sağlayıcı, tüketici siparişi onaylamadan hemen önce, verilen siparişin ödeme yükümlülüğü anlamına geldiği hususunda tüketiciyi açık ve anlaşılır bir şekilde bilgilendirmek zorundadır. Aksi halde tüketici siparişi ile bağlı değildir.

                                    (2) Tüketicinin mesafeli sözleşme kurulması amacıyla satıcı veya sağlayıcı tarafından telefonla aranması durumunda, her görüşmenin başında satıcı veya sağlayıcı kimliğini, eğer bir başkası adına veya hesabına arıyorsa bu kişinin kimliğini ve görüşmenin ticari amacını açıklamalıdır.

                                    ÜÇÜNCÜ BÖLÜM

                                    Cayma Hakkının Kullanımı ve Tarafların Yükümlülükleri

                                    Cayma hakkı

                                    MADDE 9 – (1) Tüketici, on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.

                                    (2) Cayma hakkı süresi, hizmet ifasına ilişkin sözleşmelerde sözleşmenin kurulduğu gün; mal teslimine ilişkin sözleşmelerde ise tüketicinin veya tüketici tarafından belirlenen üçüncü kişinin malı teslim aldığı gün başlar. Ancak tüketici, sözleşmenin kurulmasından malın teslimine kadar olan süre içinde de cayma hakkını kullanabilir.

                                    (3) Cayma hakkı süresinin belirlenmesinde;

                                    a) Tek sipariş konusu olup ayrı ayrı teslim edilen mallarda, tüketicinin veya tüketici tarafından belirlenen üçüncü kişinin son malı teslim aldığı gün,

                                    b) Birden fazla parçadan oluşan mallarda, tüketicinin veya tüketici tarafından belirlenen üçüncü kişinin son parçayı teslim aldığı gün,

                                    c) Belirli bir süre boyunca malın düzenli tesliminin yapıldığı sözleşmelerde, tüketicinin veya tüketici tarafından belirlenen üçüncü kişinin ilk malı teslim aldığı gün

                                    esas alınır.

                                    (4) Malın satıcı tarafından taşıyıcıya teslimi, tüketiciye yapılan teslim olarak kabul edilmez.

                                    (5) Mal teslimi ile hizmet ifasının birlikte yapıldığı sözleşmelerde, mal teslimine ilişkin cayma hakkı hükümleri uygulanır.

                                    Eksik bilgilendirme

                                    MADDE 10 – (1) Satıcı veya sağlayıcı, cayma hakkı konusunda tüketicinin bilgilendirildiğini ispat etmekle yükümlüdür. Tüketici, cayma hakkı konusunda gerektiği şekilde bilgilendirilmezse, cayma hakkını kullanmak için on dört günlük süreyle bağlı değildir. Bu süre her halükarda cayma süresinin bittiği tarihten itibaren bir yıl sonra sona erer.

                                    (2) Cayma hakkı konusunda gerektiği şekilde bilgilendirmenin bir yıllık süre içinde yapılması halinde, on dört günlük cayma hakkı süresi, bu bilgilendirmenin gereği gibi yapıldığı günden itibaren işlemeye başlar.

                                    Cayma hakkının kullanımı

                                    MADDE 11 – (1) Cayma hakkının kullanıldığına dair bildirimin cayma hakkı süresi dolmadan, yazılı olarak veya kalıcı veri saklayıcısı ile satıcı veya sağlayıcıya yöneltilmesi yeterlidir.

                                    (2) Cayma hakkının kullanılmasında tüketici, EK’te yer alan formu kullanabileceği gibi cayma kararını bildiren açık bir beyanda da bulunabilir. Satıcı veya sağlayıcı, tüketicinin bu formu doldurabilmesi veya cayma beyanını gönderebilmesi için internet sitesi üzerinden seçenek de sunabilir.  İnternet sitesi üzerinden tüketicilere cayma hakkı sunulması durumunda satıcı veya sağlayıcı, tüketicilerin iletmiş olduğu cayma taleplerinin kendilerine ulaştığına ilişkin teyit bilgisini tüketiciye derhal iletmek zorundadır.

                                    (3) Sesli iletişim yoluyla yapılan satışlarda, satıcı veya sağlayıcı, EK’te yer alan formu en geç mal teslimine veya hizmet ifasına kadar tüketiciye göndermek zorundadır. Tüketici bu tür satışlarda da cayma hakkını kullanmak için bu formu kullanabileceği gibi, ikinci fıkradaki yöntemleri de kullanabilir.

                                    (4) Bu maddede geçen cayma hakkının kullanımına ilişkin ispat yükümlülüğü tüketiciye aittir.

                                    Satıcı veya sağlayıcının yükümlülükleri

                                    MADDE 12 – (1) Satıcı veya sağlayıcı, tüketicinin cayma hakkını kullandığına ilişkin bildirimin kendisine ulaştığı tarihten itibaren on dört gün içinde, varsa malın tüketiciye teslim masrafları da dahil olmak üzere tahsil edilen tüm ödemeleri iade etmekle yükümlüdür.

                                    (2) Satıcı veya sağlayıcı, birinci fıkrada belirtilen tüm geri ödemeleri, tüketicinin satın alırken kullandığı ödeme aracına uygun bir şekilde ve tüketiciye herhangi bir masraf veya yükümlülük getirmeden tek seferde yapmak zorundadır.

                                    (3) Cayma hakkının kullanımında, 5 inci maddenin birinci fıkrasının (g) bendi kapsamında, satıcının iade için belirttiği taşıyıcı aracılığıyla malın geri gönderilmesi halinde, tüketici iadeye ilişkin masraflardan sorumlu tutulamaz. Satıcının ön bilgilendirmede iade için herhangi bir taşıyıcıyı belirtmediği durumda ise, tüketiciden iade masrafına ilişkin herhangi bir bedel talep edilemez. İade için ön bilgilendirmede belirtilen taşıyıcının, tüketicinin bulunduğu yerde şubesinin olmaması durumunda satıcı, ilave hiçbir masraf talep etmeksizin iade edilmek istenen malın tüketiciden alınmasını sağlamakla yükümlüdür.

                                    Tüketicinin yükümlülükleri

                                    MADDE 13 – (1) Satıcı veya sağlayıcı malı kendisinin geri alacağına dair bir teklifte bulunmadıkça, tüketici cayma hakkını kullandığına ilişkin bildirimi yönelttiği tarihten itibaren on gün içinde malı satıcı veya sağlayıcıya ya da yetkilendirmiş olduğu kişiye geri göndermek zorundadır.

                                    (2) Tüketici, cayma süresi içinde malı, işleyişine, teknik özelliklerine ve kullanım talimatlarına uygun bir şekilde kullandığı takdirde meydana gelen değişiklik ve bozulmalardan sorumlu değildir.

                                    Cayma hakkının kullanımının yan sözleşmelere etkisi

                                    MADDE 14 – (1) Kanunun 30 uncu maddesi hükümleri saklı kalmak koşuluyla, tüketicinin cayma hakkını kullanması durumunda yan sözleşmeler de kendiliğinden sona erer. Bu durumda tüketici, 13 üncü maddenin ikinci fıkrasında belirtilen haller dışında herhangi bir masraf, tazminat veya cezai şart ödemekle yükümlü değildir.

                                    (2) Satıcı veya sağlayıcı, tüketicinin cayma hakkını kullandığını yan sözleşmenin tarafı olan üçüncü kişiye derhal bildirmelidir.

                                    Cayma hakkının istisnaları

                                    MADDE 15 – (1) Taraflarca aksi kararlaştırılmadıkça, tüketici aşağıdaki sözleşmelerde cayma hakkını kullanamaz:

                                    a) Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak değişen ve satıcı veya sağlayıcının kontrolünde olmayan mal veya hizmetlere ilişkin sözleşmeler.

                                    b) Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler.

                                    c) Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler.

                                    ç) Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler.

                                    d) Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallara ilişkin sözleşmeler.

                                    e) Malın tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olması halinde maddi ortamda sunulan kitap, dijital içerik ve bilgisayar sarf malzemelerine ilişkin sözleşmeler.

                                    f) Abonelik sözleşmesi kapsamında sağlananlar dışında, gazete ve dergi gibi süreli yayınların teslimine ilişkin sözleşmeler.

                                    g) Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmeler.

                                    ğ) Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler.

                                    h) Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmeler.

                                    DÖRDÜNCÜ BÖLÜM

                                    Diğer Hükümler

                                    Sözleşmenin ifası ve teslimat

                                    MADDE 16 – (1) Satıcı veya sağlayıcı, tüketicinin siparişinin kendisine ulaştığı tarihten itibaren taahhüt ettiği süre içinde edimini yerine getirmek zorundadır. Mal satışlarında bu süre her halükarda otuz günü geçemez.

                                    (2) Satıcı veya sağlayıcının birinci fıkrada yer alan yükümlülüğünü yerine getirmemesi durumunda, tüketici sözleşmeyi feshedebilir.

                                    (3) Sözleşmenin feshi durumunda, satıcı veya sağlayıcı, varsa teslimat masrafları da dâhil olmak üzere tahsil edilen tüm ödemeleri fesih bildiriminin kendisine ulaştığı tarihten itibaren on dört gün içinde tüketiciye 4/12/1984 tarihli ve 3095 sayılı Kanuni Faiz ve Temerrüt Faizine İlişkin Kanunun 1 inci maddesine göre belirlenen kanuni faiziyle birlikte geri ödemek ve varsa tüketiciyi borç altına sokan tüm kıymetli evrak ve benzeri belgeleri iade etmek zorundadır.

                                    (4) Sipariş konusu mal ya da hizmet ediminin yerine getirilmesinin imkansızlaştığı hallerde satıcı veya sağlayıcının bu durumu öğrendiği tarihten itibaren üç gün içinde tüketiciye yazılı olarak veya kalıcı veri saklayıcısı ile bildirmesi ve varsa teslimat masrafları da dâhil olmak üzere tahsil edilen tüm ödemeleri bildirim tarihinden itibaren en geç on dört gün içinde iade etmesi zorunludur. Malın stokta bulunmaması durumu, mal ediminin yerine getirilmesinin imkânsızlaşması olarak kabul edilmez.

                                    Zarardan sorumluluk

                                    MADDE 17 – (1) Satıcı, malın tüketici ya da tüketicinin taşıyıcı dışında belirleyeceği üçüncü bir kişiye teslimine kadar oluşan kayıp ve hasarlardan sorumludur.

                                    (2) Tüketicinin, satıcının belirlediği taşıyıcı dışında başka bir taşıyıcı ile malın gönderilmesini talep etmesi durumunda, malın ilgili taşıyıcıya tesliminden itibaren oluşabilecek kayıp ya da hasardan satıcı sorumlu değildir.

                                    Telefon kullanım ücreti

                                    MADDE 18 – (1) Kurulmuş olan sözleşmeye ilişkin olarak tüketicilerin iletişime geçebilmesi için satıcı veya sağlayıcı tarafından bir telefon hattı tahsis edilmesi durumunda, bu hat ile ilgili olarak satıcı veya sağlayıcı olağan ücret tarifesinden daha yüksek bir tarife seçemez.

                                    İlave ödemeler

                                    MADDE 19 – (1) Sözleşme kurulmadan önce, sözleşme yükümlülüğünden kaynaklanan ve üzerinde anlaşılmış esas bedel dışında herhangi bir ilave bedel talep edilebilmesi için tüketicinin açık onayının ayrıca alınması zorunludur.

                                    (2) Tüketicinin açık onayı alınmadan ilave ödeme yükümlülüğü doğuran seçeneklerin kendiliğinden seçili olarak sunulmuş olmasından dolayı tüketici bir ödemede bulunmuş ise, satıcı veya sağlayıcı bu ödemelerin iadesini derhal yapmak zorundadır.

                                    Bilgilerin saklanması ve ispat yükümlülüğü

                                    MADDE 20 − (1) Satıcı veya sağlayıcı, bu Yönetmelik kapsamında düzenlenen cayma hakkı, bilgilendirme, teslimat ve diğer hususlardaki yükümlülüklerine dair her bir işleme ilişkin bilgi ve belgeyi üç yıl boyunca saklamak zorundadır.

                                    (2) Oluşturdukları sistem çerçevesinde, uzaktan iletişim araçlarını kullanmak veya kullandırmak suretiyle satıcı veya sağlayıcı adına mesafeli sözleşme kurulmasına aracılık edenler, bu Yönetmelikte yer alan hususlardan dolayı satıcı veya sağlayıcı ile yapılan işlemlere ilişkin kayıtları üç yıl boyunca tutmak ve istenilmesi halinde bu bilgileri ilgili kurum, kuruluş ve tüketicilere vermekle yükümlüdür.

                                    (3) Satıcı veya sağlayıcı elektronik ortamda tüketiciye teslim edilen gayrimaddi malların veya ifa edilen hizmetlerin ayıpsız olduğunu ispatla yükümlüdür.

                                    BEŞİNCİ BÖLÜM

                                    Çeşitli ve Son Hükümler

                                    Yürürlükten kaldırılan yönetmelik

                                    MADDE 21 – (1) 6/3/2011 tarihli ve 27866 sayılı Resmî Gazete’de yayımlanan Mesafeli Sözleşmelere Dair Yönetmelik yürürlükten kaldırılmıştır.

                                    Yürürlük

                                    MADDE 22 – (1) Bu Yönetmelik yayımı tarihinden itibaren üç ay sonra yürürlüğe girer.

                                    Yürütme

                                    MADDE 23 – (1) Bu Yönetmelik hükümlerini Gümrük ve Ticaret Bakanı yürütür.
                                </Typography>

                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={(e)=>{
                                    props.setDistanceClicked(e.target.value)
                                    handleClose();
                                }
                                }
                                value={props.distanceClicked}
                                color="primary">
                                I Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen2}>
                            Pre Information Conditions
                        </Button>

                        <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
                            <DialogTitle id="customized-dialog-title" onClose={handleClose2}>
                                Pre Information Conditions
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    ÖN BİLGİLENDİRME FORMU

                                    İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicilerin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği’ne uygun olarak düzenlenmiştir.

                                    MADDE 1 SATICI BİLGİLERİ

                                    Unvanı: TURŞU A.Ş.

                                    Adresi: Boğaziçi Üniversitesi Sarıyer/İstanbul

                                    MADDE 2 SÖZLEŞMENİN KONUSU VE KAPSAMI

                                    İşbu Ön Bilgilendirme Formu'nun ("Form") konusu aşağıda nitelik ve satış fiyatı belirtilen Ürünlerin ("Ürünler") satışı ve teslimi ile ilgili olarak, Tüketici’nin, 6502 sayılı Tüketicinin Korunması Hakkında Kanun (“Kanun”) ve 27 Kasım 2014 tarihli ve 29188 sayılı Resmi Gazete'de yayımlanan Mesafeli Sözleşmeler Yönetmeliği (“Yönetmelik”) hükümleri gereğince bilgilendirilmesidir.

                                    İşbu Sözleşme’nin konusunu; Tüketici’nin, Con-Teks İç ve Dış Ticaret Anonim Şirketi’ne (“Gözalan”) ait www.columbia.com.tr alan adlı web sitesinden, Satıcı’ya ait mal veya hizmetin satın alınmasına yönelik elektronik olarak sipariş verdiği, Form’da belirtilen niteliklere sahip mal veya hizmetin satışı ve teslimi ile ilgili olarak Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesi oluşturur.

                                    MADDE 3 SATIŞA KONU MALIN TEMEL ÖZELLİKLERİ VE ÖDEME BİLGİLERİ

                                    Ürünler'in tanımı, birim tutarı, adedi ve ödeme koşullarına ilişkin bilgiler aşağıda belirtildiği gibi olup, bu bilgiler Tüketici tarafından da onaylanmıştır.

                                    MADDE 4 TAAHHÜTLERİN GEÇERLİLİK SÜRESİ

                                    Madde 3'te belirtilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.

                                    Satıcı, Sözleşme konusu mal veya hizmetin tüketici mevzuatına uygun olarak, sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile Tüketici’ye teslim edilmesinden sorumludur.

                                    Satıcı, mücbir sebepler veya nakliyeyi engelleyen olağanüstü durumlar nedeni ile sözleşme konusu mal veya hizmeti süresi içinde teslim edemez ise, durumu öğrendiği tarihten itibaren 3 (üç) gün içinde Tüketici’ye bildirmekle yükümlüdür.

                                    MADDE 5 ÜRÜNLERİN TESLİMATI

                                    5.1. Malın teslimatı; ödemenin gerçekleşmesinden sonra taahhüt edilen sürede yapılır. Satıcı, sipariş konusu mal veya hizmetin ediminin yerine getirilmesinin imkansızlaştığı haller saklı kalmak kaydıyla, mal veya hizmeti, Tüketici tarafından mal veya hizmetin sipariş edilmesinden itibaren 30 (otuz) gün içinde teslim eder. Bu süre tüketiciye daha önceden yazılı olarak veya bir sürekli veri taşıyıcısıyla bildirilmek koşuluyla en fazla 10 (on) gün uzatılabilir.

                                    Herhangi bir nedenle Tüketici tarafından mal veya hizmetin bedeli ödenmez veya yapılan ödeme banka kayıtlarında iptal edilir ise, Satıcı mal veya hizmetin teslimi yükümlülüğünden kurtulmuş kabul edilir.

                                    Malın Satıcı tarafından kargoya verilmesinden sonra ve fakat Tüketici tarafından teslim alınmasından önce Tüketici tarafından yapılan sipariş iptallerinde kargo bedelinden Tüketici sorumludur.

                                    Sipariş konusu mal ya da hizmet ediminin yerine getirilmesinin imkansızlaştığı hallerde Satıcı bu durumu öğrendiği tarihten itibaren 3 (üç) gün içinde Tüketici’yi bilgilendirecek ve varsa teslimat masrafları da dâhil olmak üzere tahsil edilen tüm ödemeleri bildirim tarihinden itibaren en geç 14 (on dört) gün içinde iade edecektir.

                                    5.2. Ürünler'in, Tüketici’den gösterdiği başka bir kişiye teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden dolayı Satıcı sorumlu tutulamaz.

                                    5.3. Tüketici, Ürünler'i teslim aldığı anda kontrol etmek ve gördüğü ayıpları derhal Satıcı'ya bildirmekle yükümlüdür.

                                    MADDE 6 CAYMA HAKKI

                                    6.1 Tüketici, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, mal satışına ilişkin işlemlerde teslimat tarihinden itibaren, hizmet satışına ilişkin işlemlerde satın alma tarihinden itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir. Tüketici, malın teslimine kadar olan süre içinde de cayma hakkını kullanabilir.

                                    6.2 Tüketici, cayma hakkını ürün/leri iade ederken e-fatura çıktısı üzerinde yer alan iade nedenlerinden “cayma hakkı sebebiyle ürünleri iade ettiğini” içeren iade nedenini işaretlemesi ve ıslak imza ile imzalayarak ürünlerin iade yapılacak depo adresine gönderilmek üzere kargoya verir. Tüketici’nin ilgili sayfada yer alan iade talep formunu doldurup iade adres bilgilerini alarak, cayma hakkını kullandığı tarihten itibaren 10 (on) gün içinde malı geri göndermesi gerekmektedir.

                                    6.3 İade edilecek Ürünler ile birlikte; faturasının, ürünün kutusunun, ambalajının, varsa standart aksesuarları, ürünle beraber hediye edilen diğer ürünlerin de eksiksiz ve hasarsız olarak iade edilmesi gerekmektedir.

                                    6.4 Tüketici’nin cayma hakkını kullanmasından itibaren 14 (on dört) gün içerisinde, varsa malın teslim masrafları da dahil olmak üzere (malın Satıcı’nın iade için belirttiği taşıyıcı aracılığıyla geri gönderilmesi kaydıyla), Tüketici’nin ilgili mal veya hizmete ilişkin yaptığı tüm ödemeler Tüketici’ye satın alırken kullandığı ödeme aracına uygun bir şekilde ve tüketiciye herhangi bir masraf veya yükümlülük getirmeden ve tek seferde iade edilecektir.

                                    6.5 Tüketici iade edeceği malı Satıcı’ya Ön Bilgilendirme Formu'nda belirtilen Satıcı’nın anlaşmalı kargo şirketi ile gönderdiği sürece, iade kargo bedeli Satıcı’ya aittir. Tüketici’nin iade edeceği malı Ön Bilgilendirme Formu'nda belirtilen Satıcı’nın anlaşmalı kargo şirketi dışında bir kargo şirketi ile göndermesi halinde, iade kargo bedeli ve malın kargo sürecinde uğrayacağı hasardan Satıcı sorumlu değildir.

                                    6.6 Teslim alınmış olan malın değerinin azalması veya iadeyi imkânsız kılan bir nedenin varlığı cayma hakkının kullanılmasına engel değildir. Ancak değer azalması veya iadenin imkânsızlaşması tüketicinin kusurundan kaynaklanıyorsa Satıcı'ya malın değerini veya değerindeki azalmayı tazmin etmesi gerekir. Malın mutat kullanımı sebebiyle meydana gelen değişiklik ve bozulmalar değer azalması sayılmaz.

                                    MADDE 7 CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER

                                    Mevzuat uyarınca Tüketici aşağıdaki hallerde cayma hakkına sahip değildir:

                                    Alıcı'nın istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan, niteliği itibariyle geri gönderilmeye elverişli olmayan ve çabuk bozulma tehlikesi olan veya son kullanma tarihi geçme ihtimali olan malların satışına ilişkin sözleşmelerde;
                                    Tüketici tarafından ambalajının açılmış olması şartıyla, ses veya görüntü kayıtlarına, yazılım programlarına ve bilgisayar sarf malzemelerine ilişkin sözleşmelerde;
                                    Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmelerde;
                                    Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallara ilişkin sözleşmelerde;
                                    Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmelerde; ve
                                    Elektronik ortamda anında ifa edilen hizmetler ile tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmelerde (kupon gibi).
                                    Mesafeli Sözleşmeler Yönetmeliği’nin kapsamı dışında bırakılmış olan mal veya hizmetler (Satıcı’nın düzenli teslimatları ile Tüketici’nin meskenine teslim edilen gıda maddelerinin, içeceklerin ya da diğer günlük tüketim maddeleri ile seyahat, konaklama, lokantacılık, eğlence sektörü gibi alanlarda hizmetler) bakımından cayma hakkı kullanılamayacaktır.

                                    MADDE 8 GENEL HÜKÜMLER

                                    8.1 Tüketici, işbu Form'da satışa konu Ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve yazılı olarak gerekli teyidi verdiğini beyan eder.

                                    8.2 Tüketici; işbu Form'u yazılı olarak teyit etmekle, mesafeli sözleşmelerin akdinden önce, Satıcı tarafından tüketiciye verilmesi gereken adres, siparişi verilen Ürünlere ait temel özellikler, Ürünlerin vergiler dahil fiyatı, ödeme ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini teyit etmiş olur.

                                    8.3 Kargo firmasının, Ürünler'i Tüketici’ye teslimi aşamasında karşılaşacağı her türlü sorun nedeniyle, siparişi verilen Ürünün Tüketici’ye teslim edilememesinden dolayı Satıcı sorumlu tutulamaz.

                                    8.4 Satıcı, Ürünler'in sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile teslim edilmesinden sorumludur.

                                    8.5 Satıcı, Ürünler'in teslim süresinden önce haklı bir nedenle tedarik edilemeyeceğinin anlaşılması üzerine Tüketici’yi bilgilendirmek ve yazılı onayını almak suretiyle eşit kalite ve fiyatta farklı bir Ürün tedarik edebilir.

                                    8.6 Satıcı, Ürünler'in teslim edilmesinin imkânsızlaşması halinde bu durumu, sözleşmeden doğan ifa yükümlülüğünün süresi dolmadan Tüketici’ye bildirir ve 14 (on dört) günlük süre içinde toplam bedeli Tüketici’ye iade eder.

                                    8.7 Herhangi bir nedenle Ürün bedeli ödenmez veya banka kayıtlarında iptal edilir ise, Satıcı Ürünün teslimi yükümlülüğünden kurtulmuş kabul edilir.

                                    8.8 Ürünler'in bedelinin herhangi bir sebepten dolayı Satıcı'ya ödememesi halinde, Tüketici Satıcı'nın bildiriminden itibaren en geç 3 gün içinde Ürünleri tüm masrafları kendisine ait olmak üzere Satıcı'ya iade eder. Satıcı'nın Ürün bedeli alacağını takip dahil diğer tüm akdi-kanuni hakları ayrıca ve her halükarda saklıdır.

                                    8.9 İşbu Ön Bilgilendirme Formu kapsamında Tüketici’ye siparişinin detayları hakkında bilgilendirme yapılmakta olup, Tüketici’nin mal veya hizmetin elektronik olarak satın alınmasına ilişkin olarak Mesafeli Sözleşmeler Yönetmeliği gereğince mesafeli satış sözleşmesini onaylaması gerekmektedir.

                                    MADDE 9 UYUŞMAZLIKLARIN ÇÖZÜMÜ

                                    Tüketici, satın aldıkları mal ve hizmetlerle ilgili şikâyetlerini Satıcı'ya iletecektir. Tüketici, Satıcı'ya karşı (Gümrük ve Ticaret Bakanlığı tarafından ilan edilen değerlere bağlı olarak) ürünü satın aldığı veya ikametgâhının bulunduğu yerdeki İl veya İlçe Tüketici Hakem Heyeti'ne ya da Tüketici Mahkemesi'ne başvurabilir.

                                    MADDE 10 DİĞER HÜKÜMLER

                                    İşbu Ön Bilgilendirme Formu elektronik ortamda Tüketici tarafından okunarak kabul edildikten sonra Mesafeli Satış Sözleşmesi kurulması aşamasına geçilecektir. Tüketici, Mesafeli Satış Sözleşmesi’ni imzalamakla işbu Ön Bilgilendirme Formu şartlarını kabul ettiğini kabul taahhüt ve beyan eder.

                                    İşbu Ön Bilgilendirme Formu'nda belirtilen ön bilgileri edindiğimi teyit ederim.

                                    Satıcı : CON- TEKS İÇ VE DIŞ TİCARET A.Ş.

                                    Tarih:
                                </Typography>

                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={(e)=>{
                                    props.setPreClicked(e.target.value)
                                    handleClose2();
                                }
                                }
                                        value={props.preClicked}
                                        color="primary">
                                    I Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}