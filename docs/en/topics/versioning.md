# Versioning of Database Content

## Overview

Database content in SilverStripe can be "staged" before its publication,
as well as track all changes through the lifetime of a database record.

It is most commonly applied to pages in the CMS (the `SiteTree` class).
This means that draft content edited in the CMS can be different from published content
shown to your website visitors. 

The versioning happens automatically on read and write.
If you are using the SilverStripe ORM to perform these operations,
you don't need to alter your existing calls.

Versioning in SilverStripe is handled through the `[api:Versioned]` class.
It's a `[api:DataExtension]`, which allow it to be applied to any `[api:DataObject]` subclass.

## Configuration

Adding versioned to your `DataObject` subclass works the same as any other extension.
It accepts two or more arguments denoting the different "stages",
which map to different database tables.

	:::php
	// mysite/_config.php
	MyRecord::add_extension('Versioned("Stage","Live")');

Note: The extension is automatically applied to `SiteTree` class.

## Database Structure

Depending on how many stages you configured, two or more new tables will be created for your records.
Note that the "Stage" naming has a special meaning here, it will leave the original
table name unchanged, rather than adding a suffix.

 * `MyRecord` table: Contains staged data
 * `MyRecord_Live` table: Contains live data
 * `MyRecord_versions` table: Contains a version history (new record created on each save)

Similarly, any subclass you create on top of a versioned base
will trigger the creation of additional tables, which are automatically joined as required:

 * `MyRecordSubclass` table: Contains only staged data for subclass columns
 * `MyRecordSubclass_Live` table: Contains only live data for subclass columns
 * `MyRecordSubclass_versions` table: Contains only version history for subclass columns

## Usage

### Reading Versions

By default, all records are retrieved from the "Draft" stage (so the `MyRecord` table in our example).
You can explicitly request a certain stage through various getters on the `Versioned` class.

	:::php
	// Fetching multiple records
	$stageRecords = Versioned::get_by_stage('MyRecord', 'Stage');
	$liveRecords = Versioned::get_by_stage('MyRecord', 'Live');

	// Fetching a single record
	$stageRecord = Versioned::get_one_by_stage('MyRecord', 'Stage')->byID(99);
	$liveRecord = Versioned::get_one_by_stage('MyRecord', 'Live')->byID(99);

### Historical Versions

The above commands will just retrieve the latest version of its respective stage for you,
but not older versions stored in the `<class>_versions` tables.

	:::php
	$historicalRecord = Versioned::get_version('MyRecord', <record-id>, <version-id>);

Caution: The record is retrieved as a `DataObject`, but saving back modifications
via `write()` will create a new version, rather than modifying the existing one.

In order to get a list of all versions for a specific record,
we need to generate specialized `[api:Versioned_Version]` objects,
which expose the same database information as a `DataObject`,
but also include information about when and how a record was published.
	
	:::php
	$record = MyRecord::get()->byID(99); // stage doesn't matter here
	$versions = $record->allVersions();
	echo $versions->First()->Version; // instance of Versioned_Versoin

### Writing Versions and Changing Stages

The usual call to `DataObject->write()` will write to whatever stage is currently
active, as defined by the `Versioned::current_stage()` global setting.
Each call will automatically create a new version in the `<class>_versions` table.
To avoid this, use `[writeWithoutVersion()](api:Versioned->writeWithoutVersion())` instead.

To move a saved version from one stage to another,
call `[writeToStage(<stage>)](api:Versioned->writeToStage())` on the object.
The process of moving a version to a different stage is also called "publishing",
so we've created a shortcut for this: `publish(<from-stage>, <to-stage>)`.

	:::php
	$record = Versioned::get_by_stage('MyRecord', 'Stage')->byID(99);
	$record->MyField = 'changed';
	// will update `MyRecord` table (assuming Versioned::current_stage() == 'Stage'),
	// and write a row to `MyRecord_versions`.
	$record->write(); 
	// will copy the saved record information to the `MyRecord_Live` table
	$record->publish('Stage', 'Live');

Similarly, an "unpublish" operation does the reverse, and removes a record
from a specific stage.

	:::php
	$record = MyRecord::get()->byID(99); // stage doesn't matter here
	// will remove the row from the `MyRecord_Live` table
	$record->deleteFromStage('Live');

### Forcing the Current Stage

The current stage is stored as global state on the object.
It is usually modified by controllers, e.g. when a preview is initialized.
But it can also be set and reset temporarily to force a specific operation
to run on a certain stage.

	:::php
	$origMode = Versioned::get_reading_mode(); // save current mode
	$obj = MyRecord::getComplexObjectRetrieval(); // returns 'Live' records
	Versioned::set_reading_mode('Stage'); // temporarily overwrite mode
	$obj = MyRecord::getComplexObjectRetrieval(); // returns 'Stage' records
	Versioned::set_reading_mode($origMode); // reset current mode

### Custom SQL

We generally discourage writing `Versioned` queries from scratch,
due to the complexities involved through joining multiple tables
across an inherited table scheme (see `[api:Versioned->augmentSQL()]`).
If possible, try to stick to smaller modifications of the generated `DataList` objects.

Example: Get the first 10 live records, filtered by creation date:

	:::php
	$records = Versioned::get_by_stage('MyRecord', 'Live')->limit(10)->sort('Created', 'ASC');

### Permissions

The `Versioned` extension doesn't provide any permissions on its own,
but you can have a look at the `SiteTree` class for implementation samples,
specifically `canPublish()` and `canDeleteFromStage()`.

### Page Specific Operations

Since the `Versioned` extension is primarily used for page objects,
the underlying `SiteTree` class has some additional helpers.
See the ["sitetree" reference](/reference/sitetree) for details.

### Templates Variables

In templates, you don't need to worry about this distinction.
The `$Content` variable contain the published content by default,
and only preview draft content if explicitly requested (e.g. by the "preview" feature in the CMS).
If you want to force a specific stage, we recommend the `Controller->init()` method for this purpose.

## Recipes

### Trapping the publication event

Sometimes, you'll want to do something whenever a particular kind of page is published.  This example sends an email
whenever a blog entry has been published.

	:::php
	class Page extends SiteTree {
	  // ...
	  public function onAfterPublish() {
	    mail("sam@silverstripe.com", "Blog published", "The blog has been published");
	    parent::onAfterPublish();
	  }
	}
