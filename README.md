# QPlan

QPlan is available over the Queen's VPN at _qplan.engineering.queensu.ca_.

QPlan can be run locally after this repository is cloned, assuming NodeJS and MySQL are installed, via the following steps:

First, setup the database by executing the _qplan_schema.sql_ in the root directory on an instance of MySQL.

Then, QPlan can be run:
1. Enter _/back-end_
2. Run `npm install`
3. Run `node server/index.js`
4. Enter _/front-end_
5. Run `npm install`
6. Run `npm run serve`

## UI Application

Vue

## API Application

[This file](test/api/api_tests.json) provides information for every API route. It holds one object for each route,
 each object contains the following fields:

|Field|Description|
|-----|-----------|
|description|Describes the purpose of the API route|
|apiPath|The API route. Variables in the route are filled in as example values|
|isGet|Boolean, true = GET request, false = POST|
|postJson|Only present if isGet is false, holds a JSON used to POST request body data to the API|
|requireAdmin|Boolean, true = regular users can access this route, false = users need elevated privilege|
|expectedJsonFile|The name of the JSON file in test/api/expected_responses/(success OR failure) that holds the JSON response the API will provide|
 
In an API route, a colon means the following name is a variable. For example /api/:val can be filled in as /api/hello, and the server will see 'hello' in the request parameters.
 
Note that failure responses have not yet been added to the failure directory.

Note that in the context of a course, year means the school year. For example, 2019-2020.

It is a safe bet that if the route description includes get, it is a GET API and otherwise it is a POST.

For the following routes, search for the heading in [api_tests.json](test/api/api_tests.json) to see the example.
 
### Add custom course
__Route:__ /api/courses/custom/add

__[Success Response](test/api/expected_responses/success/add_custom_course.json)__

__Post Fields__:
* year - the school year of the course
* prefix - the course prefix
* code - the course code
* status - the user's progress on the course. 1 - Saved, 2 - in progress, 3 - completed, 0 - no status
* term - semester the course is in or was taken
* description - description of the course
* math - the math units
* natSci - the natural sciences units
* complStudies - the complementary studies units
* engSci - the engineering science units
* engDesign - the engineering design units
* credits - the number of credits 

### Remove custom course
__Route:__ /api/courses/custom/remove/:coursePrefix/:courseCode/:courseYear

__[Success Response](test/api/expected_responses/success/remove_custom_course.json)__

### Get all courses
__Route:__ /api/courses

__[Success Response](test/api/expected_responses/success/get_all_courses.json)__

### Get all user courses
__Route:__ /api/courses/user

__[Success Response](test/api/expected_responses/success/get_all_user_courses.json)__

### Get one course
__Route:__ /api/courses/:prefix/:code/:year

__[Success Response](test/api/expected_responses/success/get_one_course.json)__

### Get one course schedule
__Route:__ /api/courses/schedule/:prefix/:code/:year

__[Success Response](test/api/expected_responses/success/get_one_course_schedule.json)__

### Set user course status
__Route:__ /api/courses/user/set/:prefix/:code/year/:section/:semester/:status

Status is saved, inProgress, or completed.

__[Success Response](test/api/expected_responses/success/set_user_course_status.json)__

### Remove user course
__Route:__ /api/courses/user/remove/:prefix/:code/:year/:section

__[Success Response](test/api/expected_responses/success/remove_user_course.json)__

### Get authenticated user
__Route:__ /api/user

__[Success Response](test/api/expected_responses/success/get_user.json)__

### Get engineering graduate requirements
__Route:__ /api/grad_requirements/engineering/:discipline

__[Success Response](test/api/expected_responses/success/get_eng_grad_requirements.json)__

### Get engineering graduate requirements headings
__Route:__ /api/grad_requirements_headings/engineering

__[Success Response](test/api/expected_responses/success/get_eng_grad_requirements_headings.json)__

### Set engineering graduate requirements headings
__Route:__ /api/grad_requirements_headings/engineering/set

__[Success Response](test/api/expected_responses/success/set_eng_grad_requirements_headings.json)__

__Post Fields__: 
* identifier - This is one exception, this just acts as the primary key in the database
* worksheetName - This is the other exception, it is the name of the worksheet in the Excel document to be parsed
* year - heading for the graduation year for which the document's requirements applies to
* discipline - heading for which discipline the uploaded requirements apply to
* credits - heading for total number of credits needed
* mathematics - heading for number of math units
* naturalSciences - heading for number of natural sciences units needed
* complementaryStudies - heading for number of complementary studies units needed
* engineeringSciences - heading for number of engineering sciences units needed
* engineeringDesign - heading for number of engineering design units needed
* esAndEd - heading for number of engineering sciences + engineering design units needed
* mathAndNs - heading for number of math and natural sciences units needed
* totalAu - heading for total number of units needed
* courses400 - heading for how many 400 level courses are needed
* listBC - heading for how many list B or C courses are needed

### Get engineering disciplines
__Route:__ /api/engineering/disciplines

__[Success Response](test/api/expected_responses/success/get_eng_disciplines.json)__

### Add engineering discipline
__Route:__ /api/engineering/disciplines/add/:name

__[Success Response](test/api/expected_responses/success/add_eng_discipline.json)__

### Remove engineering discipline
__Route:__ /api/engineering/disciplines/remove/:name

__[Success Response](test/api/expected_responses/success/remove_eng_discipline.json)__

### Set calendar headings
__Route:__ /api/calendar_headings/set

__[Success Response](test/api/expected_responses/success/set_calendar_headings.json)__

__Post Fields__:
* calendar - identifier in database
* year - heading for the year of the course information in excel documents that will be uploaded with course information
* prefix - heading for course prefix
* code
* name
* term
* credits
* lecture
* lab
* tutorial
* description
* notes
* mathematics
* naturalSciences
* complementary - the heading for complementary studies credits
* engineeringSciences
* engineeringDesign
* preqrequisites - the heading for the preqrequisites of the course without HTML tags
* corequisites - without HTML tags
* exclusions - without html tags

### Remove calendar headings
__Route:__ /api/calendar_headings/remove/:identifier

__[Success Response](test/api/expected_responses/success/remove_calendar_headings.json)__

### Get calendar headings
__Route:__ /api/calendar_headings

__[Success Response](test/api/expected_responses/success/get_calendar_headings.json)__

### Get schedule headings
__Route:__ /api/schedule_headings

__[Success Response](test/api/expected_responses/success/get_schedule_headings.json)__

### Set schedule headings
__Route:__ /api/

__[Success Response](test/api/expected_responses/success/set_schedule_headings.json)__

__Post Fields__:
* identifier - identifier in database for the schedule headings
* worksheetName - name of the worksheet in the Excel document that will be uploaded with schedule information
* prefix - Excel column (the letter) that holds the course prefix
* code - Excel column (the letter) that holds the course code
* section
* classType
* startDate
* endDate
* mondayClass
* tuesdayClass
* wednesdayClass
* thursdayClass
* fridayClass
* room
* startTime
* endTime
* profFirstName
* profLastName

### Remove schedule headings
__Route:__ /api/schedule_headings/remove/:identifier

__[Success Response](test/api/expected_responses/success/remove_schedule_headings.json)__

### Get course label names
__Route:__ /api/courses/label_names

__[Success Response](test/api/expected_responses/success/get_course_label_names.json)__

### Set course label names
__Route:__ /api/courses/label_names/set

__[Success Response](test/api/expected_responses/success/set_course_label_names.json)__

__Post Fields__:
* discipline - discipline for which the course labels that will be in an uploaded Excel file
* startYear - year for which the course labels for which these are the names will take affect
* coreCommon_name - name for common core courses, also the heading in the course label Excel document that gets uploaded
* coreDiscipline_name - name for the discipline core courses, also the heading in the Excel document
* listB_name
* listC_name
* worksheetName - name of worksheet for Excel document that gets uploaded with course label information

### Get course labels
__Route:__ /api/courses/labels

__[Success Response](test/api/expected_responses/success/get_course_labels.json)__

### Set course labels
__Route:__ /api/courses/labels/set

__[Success Response](test/api/expected_responses/success/set_course_label.json)__

__Post Fields__:
* discipline - discipline for which these labels apply
* startYear - year for which these labels apply
* labels - array of objects that hold the course label name in `headingColumn`, the label in `name`, and an array of `prefix code` (e.g. `APSC 100`) pairs in the `values` field.
Need to have the common core, discipline core, list B and list C labels each as their own object in this array.

### Remove course labels
__Route:__ /api/courses/labels/remove/:discipline/:startYear

__[Success Response](test/api/expected_responses/success/remove_course_label.json)__

### Get instructor peng headings
__Route:__ /api/instructor_peng_headings

__[Success Response](test/api/expected_responses/success/get_instructor_peng_headings.json)__

### Set instructor peng headings
__Route:__ /api/instructor_peng_headings/set

__[Success Response](test/api/expected_responses/success/set_instructor_peng_headings.json)__

__Post Fields__:
* firstName - heading for the column in Excel document that will be uploaded that holds the instructor's first name
* lsatName
* isPeng
* worksheetName

### Set user profile
__Route:__ /api/update_user

__[Success Response](test/api/expected_responses/success/set_user_profile.json)__

__Post Fields__:
* firstName - new first name of the user
* lastName
* discipline
* startYear

### Set user email
__Route:__ /api/email_change/:newEmail

__[Success Response](test/api/expected_responses/success/set_user_email.json)__

### Forgot password

__Route:__ /forgot_password

__Post Fields__:
* email

### Password Reset

__Route:__ /password_reset

__Post Fields__:
* email
* newPassword - the new password for the user
* token - the token emailed to the user