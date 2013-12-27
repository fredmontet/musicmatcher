<?php
    // constantes
    define('SLING_REPO', 'http://localhost:8080/content/musicmatcher/music/*');
    // requête au Web Service et affichage
    header('content-type: text/xml');
    echo file_get_contents($url);