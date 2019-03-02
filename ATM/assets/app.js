let atm_bip = document.getElementById('atm_bip')

/**
 * @Class Player
 * Listes des joueurs et argent du joueur sur lui
 */
Player = function () {
    this.money = 30000 // Argent du joueur sur lui
    this.players = [] // liste des joueurs
    this.username = "Zaekof_"
}
Player.prototype.getPlayers = function () {
    return this.players
}
Player.prototype.getMoney = function () {
    return this.money
}
Player.prototype.getUsername = function () {
    return this.username
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
 * Navigation entre les onglets de l'atm
 */
Navigation = function () {
    this.position = null
    this.prom_wait = false
}
Navigation.prototype.bip = function() {
    atm_bip.play()
}
Navigation.prototype.changeTitle = function() {
    switch(this.position) {
        case 0:
            $('.subtitle h2').text('VOTRE SOLDE')
            break;
        case 1:
            $('.subtitle h2').text("RETIRER DE L'ARGENT")
            break;
        case 2:
            $('.subtitle h2').text("DÉPOSER DE L'ARGENT")
            break;
        case 3:
            $('.subtitle h2').text('VEUILLEZ CHOISIR UNE OPÉRATION')
            break;
        default:
            break;
    }
}
Navigation.prototype.moveTo = function (position) {
    if (this.position !== position && !this.prom_wait) {
        if (position === 3) { // MENU
            $('#bloc'+this.position).css('display','none')

            $('#bloc'+this.position).promise().done(() => {
                $('nav#menu').css('display','block')
                this.position = position
                this.changeTitle()
                this.bip()
            })
        } else {
            $('nav#menu').css('display','none')
    
            this.prom_wait = true
            $('nav#menu').promise().done(() => {
                $('#bloc'+position).css('display','block')
                this.position = position
                this.changeTitle()
                this.bip()
                this.prom_wait = false
            })
        }
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
/**
 * Fonction qui clear le champ de l'input
 * @Param Name
 */
Banque.prototype.resetInput = function (name) {
    $("input[name='"+name+"']").val('')
}
Banque.prototype.updateBalance = function () {
    $('.solde span').text(this.money)
}
/**
 * Fonction pour envoyer, deposer de l'argent
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
        default:
            break;
    }
}


/**
 * Quand l'utilisateur clique sur le nom de l'onglet
 * on change de page
 */
$(document).on('click','.menu0',function(){
    nav.moveTo(0) // solde
})
$(document).on('click','.menu1',function(){
    nav.moveTo(1) // retrait
})
$(document).on('click','.menu2',function(){
    nav.moveTo(2) // depot
})
$(document).on('click','.menu3',function(){
    nav.moveTo(3) // menu
})


/**
 * retrait
 */
$(document).on('click','#retrait_button',function(){
    if ($('#retrait_input').val() !== '')
        banque.send(1, $('#retrait_input').val())
    else
        swal("Erreur de retrait", "Merci d'indiquer un montant à retirer.", "error")
})
/**
 * depot
 */
$(document).on('click','#depot_button',function(){
    if ($('#depot_input').val() !== '')
        banque.send(0, $('#depot_input').val())
    else
        swal("Erreur de dépôt", "Merci d'indiquer un montant à déposer.", "error")
})
/**
 * retour menu
 */
$(document).on('click','#menu_retour_button',function(){
    nav.moveTo(3)
})


/**
 * Initialisation des classes
 */
    let nav = new Navigation()
    let banque = new Banque()
    let player = new Player()
nav.moveTo(3)
banque.updateBalance()
$('.welcome span').text(player.getUsername())