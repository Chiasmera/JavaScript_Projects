//Svarende til Java’s Comparator#compare(…) metode, skal der her laves nogle compare-funktioner, der
//tager to parametre, og returnerer -1, 0 eller 1 alt efter om den første parameter er mindre end, lig med
//eller større en den anden parameter.
//Der skal laves følgende compare-funktioner:
//• compare(s1, s2): Sammenligner de to tekststrenge leksikografisk.
//• compareLen(s1, s2): Sammenligner de to tekststrenge på deres længde
//• compareIgnoreCase(s1, s2): Sammenligner to tekststrenge leksikografisk uden at tage hensyn til
//store og små bogstaver
//Modificer dernæst bubbleSort funktionen fra opgave 2.2, så den nu får en compare-funktion som ekstra
//parameter. Sammenligningen i bubbleSort funktionen skal nu ske med denne compare-funktion
