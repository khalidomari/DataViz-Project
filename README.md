# Data Vizualization Project: Global Terrorism
Project repository for the Data Visualization Course COM-480 (EPFL)

Chiara Orvati,
Khalid Omari,
Skander Hajri,

# Global Terrorism Visualization

Terrorism is one of the most covered topics by the media. However, it is often the case that only terror attacks on Zrst world countries such as the USA are covered extensively, and the everyday horror in other countries is swept under the carpet. With our dataset we would like to show the global scope of terrorism and the countries which are most affected. As the dates covers a time range from 1970 until present, we hope that we will be able to see a temporal evolution in many aspects: Zrst, in the countries concerned, but also in the terrorist groups conducting the attacks, and in the type of weapons that have been used.
The target audience is the everyday citizen who would like to know more than what is covered by the media, and also learn how terrorist attacks have changed in the past 40 -50 years.


## Dataset

The Global Terrorism Database (GTD) is an open-source database including information on terrorist attacks around the world from 1970 through 2016 (with annual updates planned for the future, year 2017 in progress). The GTD includes systematic data on domestic as well as international terrorist incidents that have occurred during this time period and now includes more than 170,000 cases.

For every incident, more than 100 variables are available, amongst which are basic information, like the date and location of the incident, but also more interesting variables, like the attack type (e.g. Bombing, Assassination, Kidnapping, ...), the target (e.g. Military, Private Citizens and Property, Transportation, ...), and the name of the group who claimed responsibility for the attack.

In the following table, we list the variables used for the visualization and the values they can take:

| Variable name 	| Description |         Visualization 		| 
| ----------------------| ----------- | --------------------------------- |
| gname	| Name of the attacker group, taken from standardized list of group names. Can be "Unknown".|    Map & Chord|
|eventid| Unique identifier of a terrorist attack which was mainly used to count the number of attacks per country and geographical coordinates.| Map|
|country_txt| This field identifies the country or location where the incident occurred. In the case where the country in which an incident occurred cannot be identified, it is coded as “Unknown.”| Map|
longitude| This field records the longitude (based on WGS1984 standards) of the city in which the event occurred.| Map|
latitude|	This field records the latitude (based on WGS1984 standards) of the city in which the event occurred.| Map|
| region_txt	|	North America, Central America & Caribbean, South America, East Asia, Southeast Asia, South Asia, Central Asia, Western Europe, Eastern Europe, Middle East & North Africa, Sub-Saharan Africa, Australasia & Oceania|  Chord|
| attcktype1_txt	|	Assassination, Hijacking, Kidnapping, Barricade Incident, Bombing/ Explosion, Armed Assault, Unarmed Assault, Facility/ Infrastructure Attack, Unknown| Chord| 
| targtype1_txt	|	Buisness, Governement(General), Police, Military, Abortion related, Airports & Aircraft, Government (Diplomatic), Educational institution, Food or water supply, Journalists & Media, Maritime, NGO, Other, Private citizens & Property, Religious figures/ Institutions, Telecommunication, Terrorists/ Non-state militias, Tourists, Transportation, Unknown, Utilities, Violent political parties|  Chord|
| weaptype1_txt	|	Biological, Chemical, Radiological, Nuclear, Firearms, Explosives/Bombs/Dynamite, Fake Weapons, Incendiary, Melee, Vehicle, Sabotage Equipment, Other, Unknown|  Chord|
| success	|	1 if the attack was successfull, 0 otherwise|  Chord|
| suicide	|	1 if it was a suicide attack, 0 otherwise| Chord|

## Process Book
The Process Book can be accessed online:
on [Overleaf](https://www.overleaf.com/read/jntyybhvyjrb) (read only), 
on our [Website](https://khalidomari.github.io/Data_Vizualization_Project_Global_Terrorism/processbook.html) <br />
Or [download it as PDF](https://khalidomari.github.io/Data_Vizualization_Project_Global_Terrorism/processbook.pdf) <br />

## Website
![https://khalidomari.github.io/DataViz-Project/](https://github.com/khalidomari/Data_Vizualization_Project_Global_Terrorism/blob/master/images/viz/website.png)

[Click to visit the website](https://khalidomari.github.io/Data_Vizualization_Project_Global_Terrorism/)

## Website Screen Cast

[![ScreenCast](https://img.youtube.com/viR8-hJ8-Bgw4/0.jpg)](https://www.youtube.com/watch?v=R8-hJ8-Bgw4)

## Visualizations

#### CHORD DIAGRAM
The Chord diagram shows the inter-relationships between entities. Each entity is represented by a node segment, all arranged along a cercle. The connections between nodes, represented by an Arc (Chord), shows similarities between them.

We use the Chord diagram to characterize the most active terrorist groups. We focus on the 30 most common terrorist groups (i.e. the groups responsible for the most attacks), and show their relation to other variables. In order to guarantee the legibility of the diagram, we need to select discrete variables with not too many categories. Based on these observations, we chose to characterize the terrorist groups by the regions in which they're active, the weapons they use, their targets \& preferred type of attack, how often they're successful in their attacks and which groups conduct suicide attacks.
![Chord](https://github.com/khalidomari/DataViz-Project/blob/master/images/viz/chord_all.png)
[Click to visit the website](https://khalidomari.github.io/Data_Vizualization_Project_Global_Terrorism/)

#### MAP Visualization
In order to make the dataset express itself, and since we have a geolocalized data, we use an interactive map visualization. 
The map is showing the distribution of attacks by (longitude, latitude), the total number of attacks and also the first 5 most active terrorist groups by country.

![Map Visualization](https://github.com/khalidomari/Data_Vizualization_Project_Global_Terrorism/blob/master/images/viz/map.png)
[Click to visit the website](https://khalidomari.github.io/Data_Vizualization_Project_Global_Terrorism/)
