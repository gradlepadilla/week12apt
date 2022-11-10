class House {
    constructor(name) {
        this.name = name;
        this.rooms = [];

    }

    addRoom(name, area) {
        this.rooms.push(new Room(name, area));
    }
}

class Room {
    constructor(name, area) {
        this.name = name;
        this.area = area;

    }
}

class ApartmentService {
    static url = 'https://636c49a5ad62451f9fc7018b.mockapi.io/Promineo_Apt/apthunt';


    static getAllApartments() {
        return $.get(this.url);
    }

    static getApartment(id) {
        return $.get(this.url + `/${id}`);
    }
    static createApartment(house) {
        return $.post(this.url, house);
    }



    static updateApartment(house) {
        return $.ajax({
            url: this.url + `/${house.id}`,
            data: JSON.stringify(house),
            dataType: "json",
            contentType: "application/json",
            type:'PUT'
        });
    }
    
    
    static deleteApartment(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static houses;
    static getAllApartments() {
        ApartmentService.getAllApartments().then(houses => this.render(houses));
    }

    static createApartment(name) {
        ApartmentService.createApartment(new House (name))
        .then(() => {
            return ApartmentService.getAllApartments();
        })
    }
    static deleteApartment(id) {
        ApartmentService.deleteApartment(id)
        .then(() => {
            return ApartmentService.getAllApartments();
        })
        .then((houses) => this.render(houses));
    }

    static addRoom(id) {
        for (let house of this.houses) {
            if (house.id == id) {
                house.rooms.push(new Room($(`#${house.id}-room-name`).val(), $(`#${house.id}-room-area`).val()));
                ApartmentService.updateApartment(house) 
                 .then(() => {
                    return ApartmentService.getAllApartments();
                })
                 .then((houses) => this.render(houses));
                
            }
        }
    }

    static deleteRoom(houseId, roomId){
        for(let house of this.houses) {
            if(house.id == houseId) {
                for(let room of house.rooms){
                    if(room.id == roomId) {
                        house.rooms.splice(house.rooms.indexOf(room), 1);
                    ApartmentService.updateApartment(house)
                    .then(() => {
                        return ApartmentService.getAllApartments();
                    })
                    .then((houses) => this.render(houses));
                    }
                }
            }
        }
    }
    static render(houses) {
        this.houses = houses;
        $('app').empty();
        for (let house of houses) {
            $('#app').prepend(
                `<div id="${house.id}" class="card">
                <div class="card-header">
                <h2>${house.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteHouse(${house.id}')"> Delete</button>
                </div>

                <div class="card-body">
                    <div class="card">
                    <div class="row">
                    <div class=col-sm">
                        <input type="text" id="house.${house.id}-room-name" class ="form-control" placeholder="Room Name">
                </div>
                <div class="col-sm">
                <input type="text" id="house.${house.id}-room-area" class ="form-control" placeholder="Room Area">
                </div>
                </div>
                <button id="${house.id}-new-room" onclick="DOMManager.addRoom(${house.id}')" class="btn btn-primary form-control">Add</button>
             </div>
         </div>
    </div><br>`
            );
            for(let room of house.rooms) {
                $(`#${house.id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${room.id}"><strong>Name: </strong> ${room.name}</span>
                    <span id="name-${room.id}"><strong>Name: </strong> ${room.name}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house.id}', '${room.id}')">Delete Room</button>`
                )
            }
        }
    }
}

$('#create-new-apt').click(() => {
    DOMManager.createApartment($('#new-apt-name').val());
    $('#new-apt-name').val(' ');
});
DOMManager.getAllApartments();