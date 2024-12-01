# Chess

Play Chess with your friends or against the computer.

---

### Starting the project locally

```bash
git clone https://github.com/psidh/chess.git
```

```bash
cd chess
```

```bash
./frontend.sh
./backend-1.sh
./backend-2.sh
```

---

## Structure of the project

- Real-time Chess game : **backend-1**

- User Authentication : **backend 2**

- Chess Board : **frontend**

- Against Computer : **agi-server**

- Tech Stack: WebSockets, Chess.js, Express, Prisma, PostgreSQL, Next.js, Docker, Google GenAI

---

### Issues to be resolved

## Play 1v1

- [ ] On selecting **Play 1v1**:
  - [ ] Generate a unique match ID.
  - [ ] Push the match to a **waiting stage**.
  - [ ] Start a 2-minute timer to wait for another user to join with the same match ID.
  - [ ] Match users when another user with the same ID joins.

---

## Game Features

- [ ] Enable **ESC** to undo the last action or deselect elements.
- [ ] Highlight board pieces when selected.
  - [ ] Redirect the user to the `/home` page.
- [ ] Add the following options:
  - [ ] **Draw**
  - [ ] **Resign**

---

## License [MIT](/LICENSE)
