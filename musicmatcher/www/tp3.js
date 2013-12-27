$("document").ready(function(){
    $("div.action input").click(getHoraireXml);
    // Le plugin TableSorter va "écouter" l'élément DOM #horaire
    $("#horaire").tablesorter();
    // TableSorter "lance" un événement sortEnd une fois le tri des lignes fini.
    // Nous allons donc "écouter" cette événement est màj les classes css.
    $("#horaire").bind("sortEnd", addColorClass);
})

function addColorClass(){
    $("#horaire tbody tr").removeClass("color1");
    // grâce au css 3, il est facile d'obtenir les lignes impaires (donc les
    // paires si l'on considère la ligne d'indice 0 comme la première)
    $("#horaire tbody tr:odd").addClass("color1");
}

function getHoraireXml(){
    // this = élément où le click s'est produit
    var classe = $(this).attr('id') + '40';
    $.get("proxy.php", {classe: classe, cours: "TechWeb"}, function (xml){
        $("#horaire tbody").empty();
        // Pour tous les éléments "cours", on ajoute une ligne au tableau
        $("ScheduleEntity", xml).each(addRow);
        // Indique au plugin TableSorter que la contenu du tableau a changé
        $("#horaire").trigger("update");
        // mise à jour des css des lignes paires
        addColorClass();
    })
}

function addRow(i, xml){
    // création des noeuds DOM
    var row = $("<tr/>");
    var date = $("<td/>");
    var period = $("<td/>");
    var room = $("<td/>");
    // affectation des attributs et valeurs en provenance du XML
    date.text($("Date", xml).text().substr(0, 10));
    period.html($("Period", xml).text());
    room.html($("Room", xml).text());
    // ajout des éléments au DOM de la page
    row.append(date).append(period).append(room).appendTo($("#horaire tbody"));
}

