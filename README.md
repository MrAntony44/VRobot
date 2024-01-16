# Ρομποτάκι Mellonlab

Πρόκειται για ένα Raspberry Pi στο οποίο έχουν συνδεθεί προς το παρόν 4 DC Motors με 4 ρόδες. Αρχικά ο στόχος του ρομπότ είναι να κινείται μπροστά, πίσω καθώς και να στρίβει αριστερά δεξιά.

Ο κώδικας έχει γραφτεί σε **Python** για την κίνηση του ρομπότ και σε **Node.js** για το κομμάτι του σέρβερ. Ο Server ανοίγει το port `8080` στο Raspberry κι έτσι μπορούν να επικοινωνήσουν μαζί του οι συσκευές του τοπικού δικτύου μέσω ενός `Websocket`

## Instalation

Αρχικά, εγκαθιστούμε το [NodeJS](https://nodejs.org/en) αν δεν είναι ήδη εγκατεστημένο. Αφού κάνουμε pull τον κώδικα στο directory του κάνουμε

```bash
npm install
```

για να εγκατασταθούν όλα τα απαιτούμενα dependencies.

## API

Ο server μπορεί να λάβει 4 διαφορετικά requests:

### Handshake

Αρχικά, **μόνο μόλις γίνει connected ο client**, πρέπει να στείλει ένα `Handshake` για να γίνει establish το connection με τον server. Το `JSON` μήνυμα για το handshake είναι το εξής:

```JSON
{
    "type": "handshake",
    "content": ""
}
```

### Action

Αν θέλει το ρομπότ να κάνει κάποια κίνηση, πρέπει να στείλει ένα `Action`. Τα `Actions` προς το παρόν είναι τα εξής 4:

```
class Movements(Enum):
    FORWARD = 'forward'
    BACKWARD = 'backward'
    LEFT = 'turnleft'
    RIGHT = 'turnright'
```

 Ένα `JSON` μήνυμα για το `Action` να είναι το εξής:

```JSON
{
    "type": "action",
    "content": "forward"
}
```

Αν το Action είναι επιτυχημένο ο server απαντάει με:

```JSON
{
        "type": "action",
        "content": "Performing action forward"
}
```

αλλιώς στέλνει πίσω το error.

### Εrror

Το συγκεκριμένο request χρησιμοποιείται στην περίπτωση ώπου το client θέλει να ενημερώσει το server για κάποιο error. Στέλνει στο websocket ένα request του τύπου

```JSON
{
    "type": "error",
    "content": "Error content here"
}
```

### Wave

Τέλος, αν ένας client θέλει να κλείσει το connection φυσιολογικά θα πρέπει να στέλνει ένα `Wave`. Το request είναι:

```JSON
{
    "type": "wave",
    "content": "Wave content here"
}
```

## Testing

Για να τρέξουμε τον Server αρκεί να τρέξουμε στο root-directory του project το command

```bash
node .
```

Για τις ανάγκες του testing δημιουργήσαμε το αρχείο `client/connect.js` το οποίο μπορεί να κάνει simulate τα πιθανά requests. To αρχείο μπορεί να το τρέξει κανείς με το:

```bash
npm run client
```
