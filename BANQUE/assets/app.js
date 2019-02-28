/**
 * @Class Player
 * Listes des joueurs et argent du joueur sur lui
 */
Player = function () {
    this.money = 30000 // Argent du joueur sur lui
    this.players = [] // liste des joueurs
}
Player.prototype.getPlayers = function () {
    return this.players
}
Player.prototype.getMoney = function () {
    return this.money
}
Player.prototype.removeMoney = function (amount) {
    this.money -= amount
    console.log(this.money)
}
Player.prototype.addMoney = function (amount) {
    this.money += amount
    console.log(this.money)
}


/**
 * @Class Navigation
 * Navigation entre les onglets de la banque
 */
Navigation = function () {
    this.position = null
    this.prom_wait = false
}
Navigation.prototype.getPosition = function() {
    return this.position
}
Navigation.prototype.moveTo = function (position) {
    if (this.position !== position && !this.prom_wait) {
        $('.menu'+this.position).removeClass('active')
        $('#bloc'+this.position).fadeOut('slow')

        this.prom_wait = true
        $('#bloc'+this.position).promise().done(() => {
            $('#bloc'+position).fadeIn('slow')
            this.position = position
            this.prom_wait = false

        })
        $('.menu'+position).addClass('active')
    }
}

/**
 * @Class Banque
 * Fonction de depot, retrait, virement
 */
Banque = function () {
    this.position = null
    this.money = 0 // Argent du joueur dans la banque
    this.prom_wait = false
    this.destinataire = false
}
Banque.prototype.updateBalance = function () {
    $('.solde span').text(this.money)
}
/**
 * Fonction qui clear le champ de l'input
 * @Param Name
 */
Banque.prototype.resetInput = function (name) {
    $("input[name='"+name+"']").val('')
}

/**
 * Fonction pour envoyer, deposer, virer de l'argent
 * @Param Position, Player, Amount
 */
Banque.prototype.send = function(position, amount, player_name) {
    switch (position) {
        // DEPOT
        case 0:
            let money = player.getMoney()
            if (money < amount) {
                swal("Dépôt non effectué", "Vous ne disposez pas d'assez de fond pour effectuer le dépôt.", "error")
                this.resetInput('depot_input')
            } else {
                swal("Dépôt effectué", "Vous avez déposé "+amount+"€", "success")
                this.resetInput('depot_input')
                player.removeMoney(parseFloat(amount))
                this.money += parseFloat(amount)
                this.updateBalance()
            }
            break;
        // RETRAIT
        case 1:
            if (amount > this.money) {
                swal("Retrait non effectué", "Vous ne disposez pas d'assez de fond pour effectuer le retrait.", "error")
                this.resetInput('retrait_input')
            } else {
                swal("Retrait effectué", "Vous avez retiré "+amount+"€", "success")
                this.resetInput('retrait_input')
                player.addMoney(parseFloat(amount))
                this.money -= parseFloat(amount)
                this.updateBalance()
            }
            break;
        // VIREMENT
        case 2:
            if (amount > this.money) {
                swal("Erreur de virement", "Vous ne disposez pas d'assez de fond pour effectuer un virement.", "error")
                this.resetInput('virement_input')
                this.CloseDestinataires()
            } else {
                swal("Virement effectué", "Vous avez viré "+amount+"€ à "+player_name, "success")
                this.resetInput('virement_input')
                this.money -= parseFloat(amount)
                this.updateBalance()
                this.CloseDestinataires()
            }
            break;    
        default:
            break;
    }
}
Banque.prototype.OpenDestinataires = function () {
    $('.destinataire').fadeIn()
}
Banque.prototype.CloseDestinataires = function () {
    $('.destinataire').fadeOut()
}


/**
 * Quand l'utilisateur clique sur le nom de l'onglet
 * on change de page
 */
$(document).on('click','.menu0',function(){
    nav.moveTo(0)
})
$(document).on('click','.menu1',function(){
    nav.moveTo(1)
})
$(document).on('click','.menu2',function(){
    nav.moveTo(2)
})

/**
 * Quand l'utilisateur envoye une demande
 * pour déposer de l'argent
 */
$(document).on('click','#depot_button',function(){
    if ($('#depot_input').val() !== '')
        banque.send(0, $('#depot_input').val())
    else
        swal("Erreur de dépôt", "Merci d'indiquer un montant à déposer.", "error")
})

/**
 * Quand l'utilisateur envoye une demande
 * pour retirer de l'argent
 */
$(document).on('click','#retrait_button',function(){
    if ($('#retrait_input').val() !== '')
        banque.send(1, $('#retrait_input').val())
    else
        swal("Erreur de retrait", "Merci d'indiquer un montant à retirer.", "error")
})

/**
 * Quand l'utilisateur envoye une demande
 * pour virer de l'argent
 */
$(document).on('click','#destinataire_button',function(){
    if ($('#virement_input').val() !== '') {
        banque.OpenDestinataires()
    }
    else
        swal("Erreur de virement", "Merci d'indiquer un montant à virer.", "error")
})
$(document).on('click','#virement_annuler_button',function(){
    banque.CloseDestinataires()
})
$(document).on('click','#virement_button',function(){
    let player = $("input[name='destinataire']:checked").val()
    banque.send(2, $('#virement_input').val(), player)
})


/**
 * Initialisation des classes
 */
    let nav = new Navigation()
    let banque = new Banque()
    let player = new Player()

nav.moveTo(0)
banque.updateBalance()