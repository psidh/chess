# Chess

Play Chess with your friends

Structure of the project

### Real-time Chess game : `backEnd-1`

### User Authentication : `backEnd 2`

### Chess Board : `frontEnd`

### ValKey (beta v) : `pub-sub`

- Tech Stack: Node.js, WebSockets, Chess.js, Next.js

### Issues to be resolved

## Landing Page

- [x] Create a landing page.
- [x] Add a "Play" button on the landing page.
- [x] Ensure user authentication is required to play.

---

## Game Screen Routes

- [x] Design the game screen layout.
  - [x] Add **3 buttons**:
    - [x] **Random Game**
    - [x] **Play 1v1**
    - [x] **Profile**
    - [x] **History**

---

## Random Game

- [x] On selecting **Random Game**:
  - [x] Add the user to a **pending user** queue.
  - [x] Match with another user upon their arrival.
  - [x] Start the game when two users are matched.

---

## Play 1v1

- [ ] On selecting **Play 1v1**:
  - [ ] Generate a unique match ID.
  - [ ] Push the match to a **waiting stage**.
  - [ ] Start a 2-minute timer to wait for another user to join with the same match ID.
  - [ ] Match users when another user with the same ID joins.

---

## Game Features

- [ ] Implement **notifications** for board updates.
- [ ] Enable **ESC** to undo the last action or deselect elements.
- [ ] Highlight board pieces when selected.
- [ ] Handle **checkmate**:
  - [ ] Display appropriate messages.
  - [ ] Redirect the user to the `/home` page.
- [ ] Add the following options:
  - [ ] **Draw**
  - [ ] **Resign**

---

## Data Persistence

- [ ] Store all game data in a database.
- [ ] Optimize database interactions for faster performance.

## License [MIT](/LICENSE)