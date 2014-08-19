var score = 100;
var dealt = false;
var hand = new Array(6);
var held = new Array(6);
var deck = new Array(53);


function fname () {

  return "img/" + this.num + this.suit + ".gif";
}



function Card (num, suit) {

  this.num = num;
  this.suit = suit;
  this.fname = fname;
}




function DealDraw () {

  if (dealt) {
    Draw();
  }
  else {
    Deal();
  }
}




function Deal () {

  var card1;
  var card2;
  var temp;

  //fill the deck
  for (var i = 1; i < 14; i++) {
    deck[i] = new Card(i, "c");
    deck[i+13] = new Card(i, "h");
    deck[i+26] = new Card(i, "s");
    deck[i+39] = new Card(i, "d");
  }

  //shuffle the deck
  var n = Math.floor(400 * Math.random() +500);

  for (var i = 1; i < n; i++) {
    card1 = Math.floor(52 * Math.random() + 1);
    card2 = Math.floor(52 * Math.random() + 1);
    temp = deck[card2];
    deck[card2] = deck[card1];
    deck[card1] = temp;
  }

  //deal and display cards
  for (var i = 1; i < 6; i++) {
    hand[i] = deck[i];
    $('#card' + i)
        .slideUp('slow')
        .attr('src', hand[i].fname())
        .slideDown('slow');
    $('#hold' + i).attr('src', "img/hold.gif");
    held[i] = false;
  }

  dealt = true;
  score = score - 1; //deduct one for bet amount
  $('#total').val(score);
  $('#deal').attr('src', "img/draw.gif");
  Addscore();

}




function Hold (num) {

  if (!dealt) {
    return;
  }

  if (!held[num]) {
    held[num] = true;
    $('#hold' + num).attr('src', "img/hold2.gif");
  }
  else {
    held[num] = false;
    $('#hold' + num).attr('src', "img/hold.gif");
  }
}




function Draw () {

  var curcard = 6;

  for (var i = 1; i < 6; i++) {
    if (!held[i]) {
      hand[i] = deck[curcard++];
      $('#card' + i)
        .slideUp('slow')
        .attr('src', hand[i].fname())
        .slideDown('slow');
    }
  }

  dealt = false;
  $('#deal').attr('src', "img/deal.gif");
  score += Addscore();
  $('#total').val(score);
}




function Addscore () {

  var straight = false;
  var flush = false;
  var pairs = 0;
  var three = false;
  var tally = new Array(14);

  //sorted array for convenience
  var nums = new Array(5);

  for (var i = 0; i < 5; i++) {
    nums[i] = hand[i + 1].num;
  }

  nums.sort();

  //flush
  if (hand[1].suit == hand[2].suit &&
      hand[2].suit == hand[3].suit &&
      hand[3].suit == hand[4].suit &&
      hand[4].suit == hand[5].suit) {

    flush = true;
  }

  //straight (Ace low)
  if (nums[0] == nums[1] - 1 &&
      nums[1] == nums[2] - 1 &&
      nums[2] == nums[3] - 1 &&
      nums[3] == nums[4] - 1) {

    straight = true;
  }

  //straight (Ace high)
  if (nums[0] == 1 &&
      nums[1] == 10 &&
      nums[2] == 11 &&
      nums[3] == 12 &&
      nums[4] == 13) {

    straight = true;
  }

  //royal flush, straight flush, straight, flush
  if (straight && flush && nums[4] == 13 && nums[0] == 1) {
    $('#message').val("Royal Flush");
    return 100;
  }

  if (straight && flush) {
    $('#message').val("Straight Flush");
    return 50;
  }

  if (straight) {
    $('#message').val("Straight");
    return 4;
  }

  if (flush) {
    $('#message').val("Flush");
    return 5;
  }

  //tally array is a count for each card value
  for (var i = 1; i < 14; i++) {
    tally[i] = 0;
  }

  for (var i = 0; i < 5; i++) {
    tally[nums[i]] += 1;
  }

  for (var i = 1; i < 14; i++) {
    if (tally[i] == 4) {
      $('#message').val("Four of a Kind");
      return 25;
    }
    if (tally[i] == 3) three = true;
    if (tally[i] == 2) pairs += 1;
  }

  if (three && pairs == 1) {
    $('#message').val("Full House");
    return 10;
  }

  if (pairs == 2) {
    $('#message').val("Two Pair");
    return 2;
  }

  if (three) {
    $('#message').val("Three of a Kind");
    return 3;
  }

  if (pairs == 1) {
    if (tally[1] == 2 ||
        tally[11] == 2 ||
        tally[12] == 2 ||
        tally[13] == 2) {
      $('#message').val("Jacks or Better");
      return 1;
    }
  }

  $('#message').val("No Score");
  return 0;
}
