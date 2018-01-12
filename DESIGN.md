# Design Ideas for Chore Tracker

A simple tool for kids to track the chores they have done. Each chore has a monetary value attached to it. As a chore is completed, the value is added to the balance for the kid's allowance. Parents have the ability to add/edit/delete chores and remove a chore from being marked as complete if necessary. Parents can also grant a bonus amount if they feel that the kid has earned it.

A parent starts by creating an account for the family. The login is shared by all family members. The parent also sets a security code that will allow access
to the parental functions of the app. Parents can then add any number of child profiles to the account. All that is required is a name for the profile.

Upon logging in, users are presented with a screen for chooosing the profile that they want to use. The last selected profile is remembered for future openings of the app.

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
