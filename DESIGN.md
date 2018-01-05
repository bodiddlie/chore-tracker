# Design Ideas for Chore Tracker

A simple tool for kids to track the chores they have done. Each chore has a monetary value attached to it. As a chore is completed, the value is added to the balance for the kid's allowance. Parents have the ability to add/edit/delete chores and remove a chore from being marked as complete if necessary. Parents can also grant a bonus amount if they feel that the kid has earned it.

A parent starts by creating an account and can invite any number of authorized adults to be co-parents. All co-parents are treated equally with full administrative rights to the family account. Parents can then create child accounts. These accounts are tied to the parent, but have a separate login.

## Kids view

Header at top should show name and balance earned. Below that is a list of all the available chores.

```
  ------------------------------
  | Child Name            $5.00|
  ------------------------------
  | Clean room ($1.00)       + |
  | Feed dog ($0.25)         + |
  | Put away dishes ($0.50)  + |
```

## Parent View

Header at top should have hamburger for menu, and a total balance earned across all kids.

Main screen should show a list of each kid and their respective accrued balances. Clicking on a kid will allow the parent to edit the completed chores for that kid.

Menu should have options for closing out an allowance period, and editing the chore list.

## Data structure

### Things to model

* User
* Family
* Parent
* Child
* Chore

Wanting to use Firebase for this which means json tree for data. Initial thinking is

```json
{
  "users": {
    "parentOne": {
      "displayName": "Parent One",
      "email": "parent@adulting.com",
      "families": {
        "family1": true
      }
    },
    "parentTwo": {
      "displayName": "Parent Two",
      "email": "parent2@adulting.com",
      "families": {
        "family1": true,
        "family2": true
      }
    }
  },
  "families": {
    "family1": {
      "name": "Incredibles",
      "chores": {},
      "parents": {
        "parentOne": true,
        "parentTwo": true
      },
      "kids": {
        "kid1": {},
        "kid2": {}
      }
    }
  }
}
```
