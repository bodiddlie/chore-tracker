# Design Ideas for Chore Tracker

A simple tool for kids to track the chores they have done. Each chore has a monetary value attached to it. As a chore is completed, the value is added to the balance for the kid's allowance. Parents have the ability to add/edit/delete chores and remove a chore from being marked as complete if necessary. Parents can also grant a bonus amount if they feel that the kid has earned it.

A parent starts by creating an account for the family. The login is shared by all family members. The parent also sets a security code that will allow access to the parental functions of the app. Parents can then add any number of child profiles to the account. All that is required is a name for the profile.

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

Admin Header will show overall total owed and have a button to closeout the current earnings.

View will have two sections: chore list and profile list.

Chore list is where parents can add/edit/delete chores. Each chore will also show the last child that completed it and when.

Profile list is where parents can add/edit/delete child profiles. List shows name and total owed to each profile.
