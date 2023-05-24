# Den udleverede express-app-1.zip indeholder

## En express.js-applikation, hvor filerne index.html, annoncer.js og index.css må modificeres. Serveren kan startes med npm run dev(nodemon) eller npm start(node). Serveren anvender middleware express.static('public) således at index.html serves på port 9090

###Der skal konstrueres en webapplikation med følgende indhold og funktionalitet:
Indhold Html siden skal eksponere en tabel med
   1. Headere Cvr og Firma og omsætning
   2. Der skal være tre input felter knyttet til tabellen
   3. Der skal være en knap Tilføj firma
   4. Der skal være et felt til opbevarelse af middel omsætning
Funktionalitet
   5. Når man indtaster et cvr nummer i det ene felt, et firma i det andet felt og en omsætning i det tredie felt og klikker på knappen tilføj skal det nye firma indsættes i tabellen.
   6. Der skal valideres at cvr er et heltal>0 og at hverken cvr eller firma er falsy og ydermere at omsætning er et heltal >=0
   7. Hvis man udfylder data forkert skal der vises en fejl(alert("text")) som giver en fornuftig besked
   8. Efter et firma successfuldt er adderet skal input felterne være tomme
   9. Og yderligere skal middelomsætnings feltet være opdateret med middelværdien af alle omsætninger
   
Styling
 1. Tabellens linier skal alternere i baggrunds farve 