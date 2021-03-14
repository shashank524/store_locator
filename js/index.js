var map;
var markers = [];
var infoWindow;

window.onload = () => {
  
  
}
function initMap() {
  var losAngeles = {
      lat: 34.063380, 
      lng: -118.358080
  };  
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 11,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });
  infoWindow = new google.maps.InfoWindow();

 
  
  // show_markers();
  // set_on_click_listener();
  
}


function set_on_click_listener(){
  let store_elements = document.querySelectorAll('.store-container');
  store_elements.forEach(function(elem, index){
    elem.addEventListener('click', function(){
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}

function display_stores(stores){
  let stores_html = '';
  let ind = 0;
  for (let store of stores){
    ind += 1;
    let address = store['addressLines'];
    let phone = store['phoneNumber'];
    stores_html += `
          <div class="store-container">
            <div class="store-container-background">

              <div class="store-info-container">
                  <div class="store-address">
                      <span>${address[0]}</span>
                      <span>${address[1]}</span>
                  </div>
                  <div class="store-number-container">
                      ${ind}
                  </div>
              </div>
              <div class="store-phone-number">
                  ${phone}
              </div>
            </div>
            
          </div>
    `
    document.querySelector('.store-list').innerHTML = stores_html;  
  } 
}

function show_markers(stores  ){
  var bounds = new google.maps.LatLngBounds();
  for(let [index, store] of stores.entries()){
    let name = store['name'];
    let address = store['addressLines'][0];
    let open_status_text = store['openStatusText'];
    let phone_number = store['phoneNumber'];

    let latlng = new google.maps.LatLng(
      store['coordinates']['latitude'],
      store['coordinates']['longitude']
    );
    bounds.extend(latlng);   
    
    createMarker(latlng, name, address, open_status_text, phone_number, index+1);
  }
  map.fitBounds(bounds);

}
function createMarker(latlng, name, address, open_status_text, phone_number, ind) {
  var html = `
    <div class="store-info-wn=indow">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-status">
        ${open_status_text}
      </div>
      <div class="store-info-address">
        <div class="circle">
          <i class="fas fa-location-arrow"></i>
        </div>
        ${address}
      </div>
      <div class="store-info-phone">
        <div class="circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phone_number}
      </div>
    </div>
  `;

  // "<b>" + name + "</b> <br/>" + address;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    // icon: 'store.jpg',
    label: String(ind)
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function search_stores(){
  let found_stores = [];
  let zip_code = document.getElementById('zip-code-input').value;
  
  if (zip_code){
    for(let store of stores){
      let postal = store['address']['postalCode'].substring(0, 5);
      if (postal == zip_code){
        found_stores.push(store);
      }
    }
  }
  else{
    found_stores = stores;
  }
  clear_locations();
  display_stores(found_stores);
  show_markers(found_stores);
  set_on_click_listener();
}

function clear_locations(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

