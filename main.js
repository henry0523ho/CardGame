// Define an array of 10 numbers
const cardVal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const openCards = [];
let done = 0;

// Shuffle the array using the Fisher-Yates algorithm
for (let i = cardVal.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [cardVal[i], cardVal[j]] = [cardVal[j], cardVal[i]];
}

function block(t, callback) {
  $("#blocker").show();
  setTimeout(() => {
    $("#blocker").hide();
    callback();
  }, t);
}

function playFlipSound(){
  document.getElementById("flip").play();
}

// Output the shuffled array
console.log(cardVal);

$(document).ready(function () {
  $(".start-game").show();
  $(".main-game").hide();
  $(".finish-game").hide();
  $("#blocker").hide();
  // Get element by id based on index of cardVal
  for (let i = 0; i < cardVal.length; i++) {
    const id = i + 1;
    const cardId = `card${id < 10 ? "0" : ""}${id}`;
    const cardElement = $(`#${cardId}`);
    const flipCardBack = cardElement.find(".flip-card-back");
    const cardPhotoBack = flipCardBack.find(".card-photo-back");
    cardPhotoBack.attr("src", `src/${cardVal[i]}.png`);
  }
  done = 20;
});

$(document).ready(function () {
  // Add click event listener to all elements with class "flip-card"
  $(".flip-card").click(function (e) {
    // Get parent element with class "flip-card"
    const parentFlipCard = $(this).parent(".flip-card");
    // Get the id of the parent element
    const parentFlipCardId = parentFlipCard.prevObject[0].id;
    // console.log('Parent id:', parentFlipCardId);
    // Extract the XX value from the id
    const cardNumber = parentFlipCardId.substring(4);
    console.log(openCards);
    if (openCards.length == 0) {
      openCards.push(cardNumber);
      document.getElementById("flip").play();
      $(`#card${cardNumber}`)
        .find(".flip-card-inner")
        .toggleClass("flip-card-active");
    } else if (openCards.length == 1 && openCards[0] != cardNumber) {
      openCards.push(cardNumber);
      document.getElementById("flip").play();
      $(`#card${cardNumber}`)
        .find(".flip-card-inner")
        .toggleClass("flip-card-active");
      block(1000, () => {
        if (
          cardVal[Number(openCards[0]) - 1] == cardVal[Number(openCards[1]) - 1]
        ) {
          document.getElementById("score").play();
          console.log("match");
          $(`#card${openCards[0]}`).hide();
          $(`#card${openCards[1]}`).hide();
          openCards.length = 0;
          done -= 2;
          if (done == 0) {
            // alert("You Win!");
            document.getElementById("done").play();
            $(".main-game").hide();
            $(".finish-game").show();
          }
        } else {
          document.getElementById("flip").play();
          console.log("not match");
          $(`#card${openCards[0]}`)
            .find(".flip-card-inner")
            .toggleClass("flip-card-active");
          $(`#card${openCards[1]}`)
            .find(".flip-card-inner")
            .toggleClass("flip-card-active");
          openCards.length = 0;
        }
      });
    }

    // Log the card number to the console
    // console.log('Card number:', cardNumber);
  });
});

$(document).ready(function () {
  $("#againBtn").click(function (e) {
    location.reload();
  });
  $('#startBtn').click(function (e) {
    // Play audio with id "bgm"
    document.getElementById("bgm").play();
    $(".start-game").hide();
    $(".main-game").show();
  });
  
});

window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var canvas,
  ctx,
  w,
  h,
  particles = [],
  probability = 0.04,
  xPoint,
  yPoint;

function onLoad() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
  if (!!canvas) {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
}

function updateWorld() {
  update();
  paint();
  window.requestAnimationFrame(updateWorld);
}

function update() {
  if (particles.length < 500 && Math.random() < probability) {
    createFirework();
  }
  var alive = [];
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].move()) {
      alive.push(particles[i]);
    }
  }
  particles = alive;
}

function paint() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw(ctx);
  }
}

function createFirework() {
  xPoint = Math.random() * (w - 200) + 100;
  yPoint = Math.random() * (h - 200) + 100;
  var nFire = Math.random() * 50 + 100;
  var c =
    "rgb(" +
    ~~(Math.random() * 200 + 55) +
    "," +
    ~~(Math.random() * 200 + 55) +
    "," +
    ~~(Math.random() * 200 + 55) +
    ")";
  for (var i = 0; i < nFire; i++) {
    var particle = new Particle();
    particle.color = c;
    var vy = Math.sqrt(25 - particle.vx * particle.vx);
    if (Math.abs(particle.vy) > vy) {
      particle.vy = particle.vy > 0 ? vy : -vy;
    }
    particles.push(particle);
  }
}

function Particle() {
  this.w = this.h = Math.random() * 4 + 1;

  this.x = xPoint - this.w / 2;
  this.y = yPoint - this.h / 2;

  this.vx = (Math.random() - 0.5) * 10;
  this.vy = (Math.random() - 0.5) * 10;

  this.alpha = Math.random() * 0.5 + 0.5;

  this.color;
}

Particle.prototype = {
  gravity: 0.05,
  move: function () {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.alpha -= 0.01;
    if (
      this.x <= -this.w ||
      this.x >= screen.width ||
      this.y >= screen.height ||
      this.alpha <= 0
    ) {
      return false;
    }
    return true;
  },
  draw: function (c) {
    c.save();
    c.beginPath();

    c.translate(this.x + this.w / 2, this.y + this.h / 2);
    c.arc(0, 0, this.w, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.globalAlpha = this.alpha;

    c.closePath();
    c.fill();
    c.restore();
  },
};
