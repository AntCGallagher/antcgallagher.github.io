const newParticipantNameText = document.getElementById("newParticipantNameText");
const addParticipantButton = document.getElementById("addParticipantButton");
const clearParticipantsButton = document.getElementById("clearParticipantsButton");
const participantList = document.getElementById("participantList");
const numberOfWinnersInput = document.getElementById("numberOfWinnersInput");
const resultButton = document.getElementById("resultButton");
const resultText = document.getElementById("resultText");
const resultImage = document.getElementById("resultImage");

participants = []


addParticipantButton.onclick = function() {
    const name = newParticipantNameText.value;

    // Check name is defined
    if (name.trim() == "") {
        alert("Please specify a name for the participant.");
        return;
    }

    // Check name hasn't already been added
    for (participant of participants) {
        if (participant.name == name) {
            alert("Name already in use. Please select another name.");
            return;
        }
    }

    participants.push(new Participant(name, 0));

    refreshList();
}

function refreshList() {
    clearParticipants();

    for (participant of participants) {
        addParticipant(participant);
    }

    if (participants.length == 0) {
        const listItem = document.createElement("LI");
        const textNode = document.createTextNode("Empty");
        const formattedText = document.createElement("I");
        formattedText.appendChild(textNode);
        listItem.appendChild(formattedText);
    
        participantList.appendChild(listItem);
    }
}

function clearParticipants() {
    participantList.innerHTML = "";
}

function addParticipant(participant) {
    const listItem = document.createElement("LI");
    const textNode = document.createTextNode("Name: " + participant.name + ", Additional Rolls: " + participant.additionalRolls + " ");
    
    const incrementRollButton = document.createElement("BUTTON");
    incrementRollButton.appendChild(document.createTextNode("+"));
    incrementRollButton.onclick = function() {
        participant.additionalRolls++;
        refreshList();
    }

    const decrementRollButton = document.createElement("BUTTON");
    decrementRollButton.appendChild(document.createTextNode("-"));
    decrementRollButton.onclick = function() {
        if (participant.additionalRolls > 0) {
            participant.additionalRolls--;
            refreshList();
        }
    }

    const removeButton = document.createElement("BUTTON");
    removeButton.appendChild(document.createTextNode("Remove"));
    removeButton.onclick = function() {
        for (i = 0; i < participants.length; i++) {
            p = participants[i];
            if (p == participant) {
                participants.splice(i, 1);
                refreshList();
                return;
            }
        }
    }

    listItem.appendChild(textNode);
    listItem.appendChild(incrementRollButton);
    listItem.appendChild(decrementRollButton);
    listItem.appendChild(removeButton);

    participantList.appendChild(listItem);
}

clearParticipantsButton.onclick = function() {
    clearParticipants();
    participants = [];

    refreshList();
}

resultButton.onclick = async function () {
    // Make a copy of the participants so we can modify the list.
    const participantsWithDuplicates = flattenParticipantList(participants);

    // Check number of participants is valid.
    const numberOfParticipants = participantsWithDuplicates.length;

    if (numberOfParticipants < 2) {
        alert("Number of Participants must be at least 2.");
        return;
    }

    // Check number of winners is valid.
    const numberOfWinners = numberOfWinnersInput.value;

    if (numberOfWinners > numberOfParticipants) {
        alert("Number of Winners cannot exceed Number of Participants.");
        return;
    }

    const winners = [];
    for (i = 0; i < numberOfWinners; i++) {
        // Use random.org APi to retrieve a random participant to be a winner.
        const randomInteger = await getRandomInteger(participantsWithDuplicates.length);
        
        // Choose winner
        const winner = participantsWithDuplicates[randomInteger - 1];
        winners.push(winner);

        // Remove winner from list to avoid duplicates later.
        for (j = participantsWithDuplicates.length - 1; j >= 0; j--) {
            if (participantsWithDuplicates[j] == winner) {
                participantsWithDuplicates.splice(j, 1);
            }
        }
    }

    resultText.textContent = "Result: " + listToString(winners);

    resultImage.style.visibility = "visible";
}

function getRandomInteger(maxValue) {
    return fetch("https://api.random.org/json-rpc/2/invoke", {
        method: "POST",
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": "c93d0050-af79-4e2b-8032-703e32ba10f5",
                "n" : 1,
                "min" : 1,
                "max" : maxValue
            },
            "id" : 9000
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function (response) {
        return response.json();
    }).then(function(data) {
        return data.result.random.data[0];
    });
}

function flattenParticipantList(participants) {
    const flattened = [];
    
    for (participant of participants) {
        const name = participant.name;
        flattened.push(name);

        // Add duplicate entries for each roll
        for (i = 0; i < participant.additionalRolls; i++) {
            flattened.push(name);
        }
    }

    return flattened;
}

function listToString(list) {
    result = "";

    if (list.length > 0) {
        result += list[0];

        for (i = 1; i < list.length; i++) {
            result += ", " + list[i];
        }
    }

    return result;
}

class Participant {
    constructor(name, additionalRolls) {
        this.name = name;
        this.additionalRolls = additionalRolls;
    }
}