$(document).ready(function() {
  // function for selecting initial character
  function selectCharacter(characterHP, characterName, ap) {
    $('#darthVader, #hanSolo, #chewbecca, #yoda').on('click', function(event) {
      // remove characters from the start div upon character selection
      $('#start').empty();

      // display selected character
      var chosenCharacter = event.currentTarget.id;
      $('#character').html(
        `<div id=${chosenCharacter}> ${
          characterName[chosenCharacter]
        }<br><img class='img-thumbnail' src="assets/images/${chosenCharacter}.jpg" alt=""><br><p id="${chosenCharacter}Value">${
          characterHP[chosenCharacter]
        }</p></div>`
      );

      // display enemies
      // 1) determine enemies by removing chosen character from list of all characters
      var enemies = Object.keys(characterName).filter(enemy => {
        return enemy !== chosenCharacter;
      });
      // 2) display filtered list of characters in the enemies div
      enemies.forEach(enemy => {
        // append enemies
        $('#enemies').append(
          `<div class="w-25 p-3" id=${enemy}> ${
            characterName[enemy]
          }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
            characterHP[enemy]
          }</p></div>`
        );
        $(`#${enemy}`).css({
          'background-color': 'red',
          'border-color': 'black',
          'border-width': '1px',
          padding: '2px'
        });
      });

      // change background color to red for enemies
      // 1) determine enemy ids
      var enemyIDs = enemies
        .map(enemy => {
          return '#' + enemy;
        })
        .toString();
      // choose one character
      var click = 0;
      // 2) one character is chosen from the enemies list
      $(enemyIDs).one('click', function(enemy) {
        click++;
        // only allow 1 click such that multiple enemies cannot be select at the same time
        if (click === 1) {
          var enemy = enemy.currentTarget.id;
          // remove enemy from enemies div
          $('#' + enemy).remove();

          // add enemy to defender div
          $('#defender').html(
            `<div id=${enemy}> ${
              characterName[enemy]
            }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
              characterHP[enemy]
            }</p></div>`
          );
        }
      });
    });
  }

  // function to display chosen enemy in defender div
  function displayEnemy(remainingEnemies, characterName, characterHP) {
    $(remainingEnemies.toString()).one('click', function(enemy) {
      var enemy = enemy.currentTarget.id;
      // remove enemy from enemies div
      $('#' + enemy).remove();

      // add enemy to defender div
      $('#defender').html(
        `<div id=${enemy}> ${
          characterName[enemy]
        }<br><img class='img-thumbnail' src="assets/images/${enemy}.jpg" alt=""><br> <p id="${enemy}Value">${
          characterHP[enemy]
        }</p></div>`
      );
      $('#defender').show();
    });
  }

  // function for attack button
  function attack(characterHP, characterName, ap) {
    // keep track of number of defeated enemies (in order to determine winner) and number of clicks
    var defeatedEnemyList = [];
    var clicks = 1;

    $('#attack').on('click', function(event) {
      // only works if characters have been chosen, the attack button will not fire in the start of the game when no characters have been chosen!

      if ($('#start').children().length !== 4 && $('#defender').children().length !== 0) {
        // 1) determine character and enemy
        var character = $('#character').children()[0].id;
        var enemy = $('#defender').children()[0].id;

        // 2) take away attack points from enemy's health points, depeninding on the number of clicks (attacks) and display on screen
        characterHP[enemy] -= ap[character] * clicks;
        $('#' + enemy + 'Value').html(characterHP[enemy]);
        if (characterHP[enemy] > 0) {
          // 2) take away attack points from character's health points, if enemy's healthy points are positive and display on screen
          characterHP[character] -= ap[enemy];
          $('#' + character + 'Value').html(characterHP[character]);
        }

        // 3) display messages during battle!
        if (characterHP[character] > 0 && characterHP[enemy] > 0) {
          // if both chosen character and defender are alive (HP>0)
          $('#message').html(
            `<p>You attacked ${characterName[enemy]} for ${ap[character] *
              clicks} damage.</p><p>${
              characterName[enemy]
            } attacked you back for ${ap[enemy]} damage.`
          );
        } else if (characterHP[character] > 0 && characterHP[enemy] < 0) {
          // if enemy is dead add enemy to list of defeated enemies and display message for user to select another defender
          defeatedEnemyList.push(enemy);
          $('#message').html(
            `<p>You have defeated ${
              characterName[enemy]
            }, you can choose to fight another enemy.</p>`
          );
          // hide defeated defender and display remaining enemies
          $('#defender').hide();
          var remainingEnemies = [];
          for (let i = 0; i < $('#enemies').children().length; i++) {
            remainingEnemies.push('#' + $('#enemies').children()[i].id);
          }
          displayEnemy(remainingEnemies, characterName, characterHP);

          // determine length of defeated enemies
          defeatedEnemyList = Array.from(new Set(defeatedEnemyList));
          // if all enemies have been defeated the player wins the game
          if (defeatedEnemyList.length === 3) {
            $('#message').text('You win!! GAME OVER!!');
            $('#message').append("<br><button id='restart'>Restart</button>");
          }
        } else {
          // if other condition have not been met, the player has lost the game
          $('#message').text('You have been defeated... GAME OVER!!');
          $('#message').append("<br><button id='restart'>Restart</button>");
        }
        clicks++;
      }
    });
  }

  // function to play the game 1) display chosen characters 2) attack defenders
  function reset() {
    var characterHP = {
      darthVader: 120,
      hanSolo: 100,
      chewbecca: 150,
      yoda: 180
    };
    var characterName = {
      darthVader: 'Darth Vader',
      hanSolo: 'Han Solo',
      chewbecca: 'Chewbecca',
      yoda: 'Yoda'
    };
    // Counter Attack Points
    var ap = {
      darthVader: 8,
      hanSolo: 5,
      chewbecca: 20,
      yoda: 25
    };
    selectCharacter(characterHP, characterName, ap);
    attack(characterHP, characterName, ap);
  }

  // function to restart game
  $(document).on('click', '#restart', function() {
    $('.container').html(
      '<h2>Rules: 1) select character 2) select defender 3) Attack! 4) Repeat 2 and 3</h2><div id="start"><div id="darthVader">Darth Vader<br><img class="img-thumbnail" src="assets/images/darthVader.jpg" alt=""><br><p id="darthVaderValue">120</p></div><div id="hanSolo">Han Solo<br><img class="img-thumbnail" src="assets/images/hanSolo.jpg" alt=""><br><p id="darthVaderValue">100</p></div><div id="chewbecca">Chewbecca<br><img class="img-thumbnail" src="assets/images/chewbecca.jpg" alt=""><br><p id="darthVaderValue">150</p></div><div id="yoda">Yoda<br><img class="img-thumbnail" src="assets/images/yoda.jpg" alt=""><br><p id="darthVaderValue">180</p></div></div><h2>Your character</h2><div id="character"></div><h2>Enemies Available To Attack</h2><div id="enemies"></div><h2>Fight Section</h2><button id="attack">Attack</button><div id="message"></div><h2>Defender</h2><div id="defender"></div>'
    );
    reset();
  });

  // start game
  reset();
});
