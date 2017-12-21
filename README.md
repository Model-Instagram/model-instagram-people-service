# Model-Instagram-People-Service
Service API to handle users, advertisers, and their relationships

# Description
The People-Service API receives requests from the Content Service and the Ad Service.

# API Input Requests
From Content Service:
- When new Post is created, the People-Service will receive a request to find all users that are following the Post Creator.
- When a new Post Like is created, the People-Service will receive a request to find all users that are followers of both the Post and the Liker.

From Ad Service:
- When the Ad Feed is being created, the People-Service will receive a request to find all users that the prospective Ad Viewer is following.
- When a new Ad Like is created, the People-Service will receive a request to find all users that are followers of the Ad Liker.
