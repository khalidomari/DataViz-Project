# DataViz-Project
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

| Variable name       				| Description |
| ----------------------------------| ---------------------------------- |
| Variable name	|	Description| 
| gname	|	Name of the attacker group, taken from standardized list of group names. Can be "Unknown".| 
| region_txt	|	North America, Central America & Caribbean, South America, East Asia, Southeast Asia, South Asia, Central Asia, Western Europe, Eastern Europe, Middle East & North Africa, Sub-Saharan Africa, Australasia & Oceania| 
| attcktype1_txt	|	Assassination, Hijacking, Kidnapping, Barricade Incident, Bombing/ Explosion, Armed Assault, Unarmed Assault, Facility/ Infrastructure Attack, Unknown| 
| targtype1_txt	|	Buisness, Governement(General), Police, Military, Abortion related, Airports & Aircraft, Government (Diplomatic), Educational institution, Food or water supply, Journalists & Media, Maritime, NGO, Other, Private citizens & Property, Religious figures/ Institutions, Telecommunication, Terrorists/ Non-state militias, Tourists, Transportation, Unknown, Utilities, Violent political parties| 
| weaptype1_txt	|	Biological, Chemical, Radiological, Nuclear, Firearms, Explosives/Bombs/Dynamite, Fake Weapons, Incendiary, Melee, Vehicle, Sabotage Equipment, Other, Unknown| 
| success	|	1 if the attack was successfull, 0 otherwise| 
| suicide	|	1 if it was a suicide attack, 0 otherwise|

## Process Book
The Process Book can be accessed online:
on [Overleaf](https://www.overleaf.com/read/jntyybhvyjrb) (read only), 
on our [Website](https://khalidomari.github.io/DataViz-Project/processbook.html) <br />
Or [download it as PDF](https://khalidomari.github.io/DataViz-Project/vizReport.pdf) <br />

## Website
![https://khalidomari.github.io/DataViz-Project/](https://github.com/khalidomari/DataViz-Project/blob/master/images/viz/website.png)

[Click to visit the website](https://khalidomari.github.io/DataViz-Project/)

## Website Screen Cast
[![Screen Cast](https://img.youtube.com/vi/G9q_9Dk1p_I/0.jpg)](https://www.youtube.com/watch?v=G9q_9Dk1p_I)

## Visualizations

#### CHORD DIAGRAM
The Chord diagram shows the inter-relationships between entities. Each entity is represented by a node segment, all arranged along a cercle. The connections between nodes, represented by an Arc (Chord), shows similarities between them.

We use the Chord diagram to characterize the most active terrorist groups. We focus on the 30 most common terrorist groups (i.e. the groups responsible for the most attacks), and show their relation to other variables. In order to guarantee the legibility of the diagram, we need to select discrete variables with not too many categories. Based on these observations, we chose to characterize the terrorist groups by the regions in which they're active, the weapons they use, their targets \& preferred type of attack, how often they're successful in their attacks and which groups conduct suicide attacks.
![Chord](https://github.com/khalidomari/DataViz-Project/blob/master/images/viz/chord_all.png)
[Click to visit the website](https://khalidomari.github.io/DataViz-Project/)

#### MAP Visualization
![Map Visualization](https://github.com/khalidomari/DataViz-Project/blob/master/images/viz/map.png)
[Click to visit the website](https://khalidomari.github.io/DataViz-Project/)


# TO DO
## Process Book:

    Add examples for the map!!

	- Discussion:
		- What we learned about the data:
			-add examples for map!

	- Evaluation of the Visualizations:  How well does your visualization work, and how could you further improve it
		- Future Improvement
			- Map Visualization:
				-  Show summaries of some attacks ...
				- Time selection: small number of events by country, nothing to visualize in some time periods
				- Visualize by regions
				- Russia / Usa, can't visualize attacks due to the size and geographically sparsed.

    - Peer Evaluations!!


## ScreenCast (2 min) max +5sec
	- Website (dataset, process book, screencast, menu ...) 40sec
	- Chord Diagram 40sec
	- Map Visualization 40sec
## Website
	x link to github repo
	- Check everything
## Github
	** Readme: add some technical descriptions
	X link to the screencast

