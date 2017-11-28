# su
ORO intranet page backbone

[![Build Status](https://travis-ci.org/gybloglearn/su.svg?barnch=master)]
(https://travis-ci.org/gybloglearn/su)

<h1>Használati utasítás:</h1>
<b>Legyen: </b><br>
<ol>
  <li><i>node js</i> telepítve</li>
  <li><i>git</i> telepítve</li>
  <li>helyi webserver (<i>xampp</i> vagy <i>wamp</i> Windowsra)</li>
<li>a helyi webserver kiszolgáló könyvtárában a <code><i>su_components/</i></code> mappa (nem publikus elemekkel, ezért kérd a fejlesztőtől)</li>
</ol>
<br><br>
<h2>Telepítés: </h2>
<code>
cmd.exe
</code>
<br>
El kell indítani a helyi webserver-t (xampp, wamp)<br>
Be kell "menni" abba a mappába, ahonnan a fejlesztői szerver kiszolgálja az adatokat (pl: xampp/htdocs, vagy wamp/www)

<code>
$> git clone https://github.com/gybloglearn/su.git <b>[<i>projektNév</i>]</b>
</code>
<code>
$> git checkout -b <b>[<i>projektNév</i>]</b>
</code>
<br><br>
<h2>Opcionálisan: </h2>
<p>Az alábbi telepítés lefuttatása ahhoz szükséges, hogy dinamikusan lehessen új útvonalakat (route-okat) és új adatszolgáltatásokat (service-eket) telepíteni az alkalmazás fejlesztése során.<br>
<code>
$> npm install
</code></p>

<h3>Route hozzáadása</h3>
<sub>Az AngularJS alkalmazás fejlesztés sajátosságai miatt az elnevezések isrmerősek lehetnek.</sub><br>
<code>
  $> gulp addroute --controller=[<i><b>RouteNév</b></i>]
</code><br>
<p>Lehetőség van továbbá RouteNév-hez társítani egy icon-t is, választva a <a href="https://material.io/icons/" target="_blank">material.io</a> ikonjai közötti felsorolásban szereplő <i>icon font</i> nevek közül.<br>
<code>
  $> gulp addroute --controller=[<i><b>RouteNév</b></i>] --icon=[<i><b>icon_font_elnevezés</b></i>]
</code>
</p>
<br><br>
<p>A fenti kód az alábbi folyamatot végzi el:
<ol>
  <li>Hozzáadja az <code>index.html</code> file-hoz az új útvonal linkjét, és controllerjének <code><script></code> tag-jét</li>
  <li>Beköti a <code>config.js</code> file-ban az új útvonal <code>$state</code>-jét</li>
  <li>Bemásolja a megfelelő helyre a <code>.ctrl.js</code> és <code>.html</code> file-okat a megfelelő mappába</li>
  <li>Kicseréli a megfelelő file-okban a megnezevzéseket</li>
</ol></p>
<h3>Service hozzáadása</h3>
<sub>Az AngularJS alkalmazás fejlesztés sajátosságai miatt az elnevezések isrmerősek lehetnek.</sub><br>
<code>
  $> gulp addservice --service=[<i><b>ServiceNév</b></i>] --serviceUrl=[<i><b>service/elérési/útvonal</b></i>]
</code>
<br><br>
<p>A fenti kód az alábbi folyamatot végzi el:
<ol>
  <li>Hozzáadja az <code>index.html</code> az új service <code><script></code> tag-jét</li>
  <li>Bemásolja a <code>.service.js</code> file-t a <code>app/components/services</code> mappába</li>
  <li>Kicseréli a megfelelő file-okban a megnezevzéseket, linkeket</li>
</ol></p>
<br><br>
<h2>Feltöltés:</h2>
<p>Az alkalmazás fejlesztésének végén - de inkább közben többször - az alábbi kódrészlettel és egy github.com account-tal fel lehet tölteni az új branch-et ide:<br>
<code>
  $> git push origin <i><b>projektNév</b></i>
</code></p>