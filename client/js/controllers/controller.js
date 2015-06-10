/**
 * Created by nevena on 9.4.15..
 */

app.controller('LekoviController', ['$scope', '$sce', '$mdSidenav', 'Drugs', 'Atcs', 'Indications', 'Guidelines', 'Packagings', function($scope, $sce, $mdSidenav, Drugs, Atcs, Indications, Guidelines, Packagings) {
  $scope.ucitano = false;
  $scope.prikaziJos = true;
  $scope.trenutniId = 0;
  $scope.ucitanSadrzaj = false;
  $scope.lekovi = [];
  $scope.trezeniLek = "";
  $scope.pretraga = function(pre){
    $scope.trezeniLek = pre;
  };

  $scope.lekovi = Drugs.find({
    filter: {
      where: { id: {between: [1, 150]} }
    }
  }, function(){
    $scope.ucitano = true;
    $scope.prikaziJos = true;
  });


  $scope.nemaRez = false;
  $scope.pokreniPretragu = function(pretraga){
    $scope.lekovi = [];
    $scope.ucitano = false;
    $scope.prikaziJos = false;

    //ako je unos pretrage prazan string --> vrati pocetno stanje
    if (pretraga == "") {
      $scope.lekovi = Drugs.find({
        filter: {
          where: { id: {between: [1, 150]} }
        }
      }, function(){
        $scope.ucitano = true;
        $scope.prikaziJos = true;
      });
    } else {
      //ako je unos pretrage jedno slovo --> pretraziti sve nazive koji pocinju tim slovom
      if (pretraga.length == 1){
        var prvoSlovo = Drugs.find({
          order: 'naziv DESC',
          filter: {
            where: {registeredName: {like: pretraga + "%"}}
          }
        }, function () {
          $scope.ucitano = true;
          for (i = 0; i < prvoSlovo.length; i++) {
            $scope.lekovi.push(prvoSlovo[i]);
          }
          ;
        });
      }else {
        var nazivi = Drugs.find({
          order: 'naziv DESC',
          filter: {
            where: {registeredName: {like: "%" + pretraga + "%"}}
          }
        }, function () {
          $scope.ucitano = true;
          for (i = 0; i < nazivi.length; i++) {
            $scope.lekovi.push(nazivi[i]);
          };
        });

        var paralele = Drugs.find({
          order: 'naziv DESC',
          filter: {
            where: {paralele: {like: "%" + pretraga + "%"}}
          }
        }, function () {
          $scope.ucitano = true;
          for (i = 0; i < paralele.length; i++) {
            $scope.lekovi.push(paralele[i]);
          }
          ;
        });
      }
    }
    /*console.log(pretraga);
     console.log($scope.lekovi);*/
  };

  $scope.loadMore = function() {
    $scope.trenutniId = $scope.lekovi.length;
    var jos = Drugs.find({
      filter: {
        where: {id: {between: [$scope.trenutniId, $scope.trenutniId+150]}}
      }
    }, function(){
      for (i = 0; i< jos.length; i++){
        $scope.lekovi.push(jos[i]);
      }
    });
  };



  $scope.prikaz = function(lek){
    $scope.ucitanSadrzaj = true;
    $scope.podaci = lek;

    $scope.sastav = lek.ingredient;
    if (lek.insuranceList == null){
      $scope.osiguranje = "Nema";
    } else{
      $scope.osiguranje = lek.insuranceList;
    };

    podaciLeka($scope.podaci, Indications, Guidelines, Packagings, $scope, $sce);


    // ** PARALELE ** //
    $scope.paralele = paraleleLeka($scope, lek, Atcs);

    $scope.par = Drugs.find({
      filter:{
        where: {atc: lek.atc}
      }
    }, function(){
      console.log($scope.par);
    });

    var id = lek.id;

  };

  $scope.uzmiParalelu = function (paralela) {
    $scope.podaci = paralela.p;

    $scope.par = Drugs.find({
      filter:{
        where: {atc: $scope.podaci.atc}
      }
    }, function(){
      console.log($scope.par);
    });

    podaciLeka($scope.podaci, Indications, Guidelines, Packagings, $scope, $sce);

  };


  $scope.pretraziParalelu = function(paralela) {
    $scope.input = paralela;

    console.log($scope.input);
  };

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };


}]);





function paraleleLeka($scope, lek, Atcs){
  var nizParalela = [];
  var par1 = Atcs.findById({
    id: lek.atc1Id
  });
  nizParalela.push(par1);

  var par2 = Atcs.findById({
    id: lek.atc2Id
  });
  nizParalela.push(par2);

  var par3 = Atcs.findById({
    id: lek.atc3Id
  });
  nizParalela.push(par3);

  var par4 = Atcs.findById({
    id: lek.atc4Id
  });
  nizParalela.push(par4);

  var par5 = Atcs.findById({
    id: lek.atc5Id
  });
  nizParalela.push(par5);
  $scope.paralele = nizParalela;
  //console.log($scope.paralele);

  return $scope.paralele;
}



function podaciLeka(lek, Indications, Guidelines, Packagings, $scope, $sce){
  // ** INDIKACIJE ** //
  $scope.indProvera = false;
  $scope.ind = Indications.findById({
    id: lek.indicationId
  }, function(){
    $scope.indProvera = true;
  });

  // ** DIREKTIVA ** //
  $scope.direktivaProvera = false;
  $scope.direktiva = Guidelines.findById({
    id: lek.guidelineId
  }, function(){
    $scope.direktivaProvera = true;
  });

  // ** DOZIRANJE ** //
  $scope.doziranje = lek.dosing;
  $scope.deliberatelyTrustDangerousSnippetDoz = function() {
    return $sce.trustAsHtml($scope.doziranje);
  };

  // ** TRUDNOCA ** //
  $scope.trudnoca = lek.pregnancy;
  $scope.deliberatelyTrustDangerousSnippetTrud = function() {
    return $sce.trustAsHtml($scope.trudnoca);
  };

  // ** INDIKACIJE ** //
  $scope.indikacije = lek.indications;
  $scope.deliberatelyTrustDangerousSnippetInd = function() {
    return $sce.trustAsHtml($scope.indikacije);
  };

  // ** KONTRAINDIKACIJE ** //
  $scope.kontraindikacije = lek.contraindications;
  $scope.deliberatelyTrustDangerousSnippetKonInd = function() {
    return $sce.trustAsHtml($scope.kontraindikacije);
  };

  // ** VOZNJA ** //
  $scope.voznja = lek.driving;
  $scope.deliberatelyTrustDangerousSnippetVoz = function() {
    return $sce.trustAsHtml($scope.voznja);
  };

  // ** UPOZORENJE ** //
  $scope.upozorenje = lek.warnings;
  $scope.deliberatelyTrustDangerousSnippetUpoz = function() {
    return $sce.trustAsHtml($scope.upozorenje);
  };

  // ** PREDOAZIRANJE ** //
  $scope.predoziranje = $scope.podaci.overdose;
  $scope.deliberatelyTrustDangerousSnippetPredoz = function() {
    return $sce.trustAsHtml($scope.predoziranje);
  };

  // ** NEZELJENA DEJSTVA ** //
  $scope.nezDej = lek.undesirable;
  $scope.deliberatelyTrustDangerousSnippetNezDej = function() {
    return $sce.trustAsHtml($scope.nezDej);
  };

  // ** INTERAKCIJA ** //
  $scope.interakcija = lek.interactions;
  $scope.deliberatelyTrustDangerousSnippetInt = function() {
    return $sce.trustAsHtml($scope.interakcija);
  };

  // ** PAKOVANJE ** //
  $scope.pakovanja = Packagings.find({
    filter: {
      where: { drugId: lek.id}
    }
  }, function(){
    console.log($scope.pakovanja);
  });
}
