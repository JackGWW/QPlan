import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './../router'

// Load data from local files instead of backend
import courseData from '@/allCourses.json'
import compGradRequirements from '@/computerGradRequirements.json'
import compCoreCourses from '@/coreCourses.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        apiUrl: '',
        authUrl: '',
        baseUrl: '',
        csrfToken: '',
        courses: [],
        firstLogin: false,
        seenGuide: false,
        globalError: false,
        globalErrorMessage: '',
        recentlyViewedCourses: [],
        authenticated: false,
        creatingAccount: false,
        showRemovedSnackbarHome: false,
        showRemovedSnackbarProgress: false,
        recentlyRemovedCourse: undefined,
        recentlyRemovedCourseStatus: undefined,
        showProgressSidebar: true,
        showRecentSidebar: true,
        validDisciplines: ["Chemical", "Civil", "Computer", "Electrical", "Eng. Chem", "Eng. Phys", "Geological", "Mathematics", "Mechanical", "Mining"],
        disciplinePrefixMapping: {
            "Chemical": ["APSC", "CHEE", "MICR"],
            "Civil": ["APSC", "CIVL"],
            "Computer": ["APSC", "ELEC", "CMPE", "SOFT"],
            "Electrical": ["APSC", "ELEC", "CMPE"],
            "Eng. Chem": ["APSC", "CHEE", "MICR", "ENCH"],
            "Eng. Phys": ["APSC", "ENPH"],
            "Geological": ["APSC", "GEOE", "GPHY"],
            "Mathematics": ["APSC", "MTHE"],
            "Mechanical": ["APSC", "MECH"],
            "Mining": ["APSC", "MINE", "MNTC"],
        },
        semesterMapping: {
            "F": "Fall",
            "W": "Winter",
            "S": "Summer",
            "FW": "Fall+Winter",
            "OL": "Online",
            "": "Online",
            "F/W": "Fall/Winter",
            "W/F": "Fall/Winter",
            "W/S": "Winter/Summer",
            "F/W/S": "Fall/Winter/Summer",
            "FW/S": "Fall+Winter/Summer",
            "F/OL": "Fall(Online)",
            "W/OL": "Winter(Online)",
            "S/OL": "Summer(Online)",
            "F/W/OL": "Fall(Online)/Winter(Online)",
            "W/S/OL": "Winter(Online)/Summer(Online)",
            "F/W/S/OL": "Fall(Online)/Winter(Online)/Summer(Online)",
            "W/OL/F/OL": "Fall(Online)/Winter(Online)",
        },
        userDiscipline: undefined,
        userStartYear: undefined,
        userEmail: undefined,
        firstName: undefined,
        lastName: undefined,
        labelNames: { // All the valid labels for the current discipline
            listB: "List B",
            listC: "List C",
            level400: "400 Level",
            coreCommon: "Common Core",
            coreComputer: "Discipline Core",
            complementaryCredits: "Complementary Courses",
            isCustom: "Custom Course",
        },
        graduationRequirements: {},  //Graduation requirements for the current discipline
        maxLabelCounts: [
            {
                label: "listC",
                value: 5,
            }
        ],
        disciplineContact: { //Updates upon changing discipline
            name: "Irina Pavich",
            emailAddr: "irina.pavich@queensu.ca",
            location: "Walter Light Hall 416B",
            position: "Undergraduate Program Assistant",
            discipline: "Computer",
        }
    },
    getters: {
        showProgressSidebar: state => state.showProgressSidebar,
        showRecentSidebar: state => state.showRecentSidebar,
        showRemovedSnackbarHome: state => state.showRemovedSnackbarHome,
        showRemovedSnackbarProgress: state => state.showRemovedSnackbarProgress,
        recentlyRemovedCourse: state => state.recentlyRemovedCourse,
        graduationRequirements: state => state.graduationRequirements,
        userDiscipline: state => state.userDiscipline,
        authenticated: state => state.authenticated,
        creatingAccount: state => state.creatingAccount,
        labelNames: state => state.labelNames,
        semesterMapping: state => state.semesterMapping,
        globalError: state => state.globalError,
        globalErrorMessage: state => state.globalErrorMessage,
        allSearchOptions: state => {
            return state.courses.map(course => course.courseCode + " " + course.name)
        },
        allPrefixes: state => {
            return state.courses.map(course => course.prefix)
        },
        course: (state) => (id) => {
            return state.courses.find(course => course.id === id)
        },
        findCourseByCode: (state) => (toFind) => {
            return state.courses.find(course => course.courseCode === toFind)
        },
        coursesCompleted: state => {
            return state.courses.filter(course => course.status === 'completed')
        },
        coursesInProgress: state => {
            return state.courses.filter(course => course.status === 'inProgress')
        },
        coursesSaved: state => {
            return state.courses.filter(course => course.status === 'saved')
        },
        coursesInProgressOrSaved: (state, getters) => {
            return getters.coursesInProgress.concat(getters.coursesSaved)
        },
        coursesPlanned: (state, getters) => {
            return getters.coursesCompleted.concat(getters.coursesInProgress, getters.coursesSaved)
        },
        contactInfo: state => {
            return state.disciplineContact
        },
        coursesSemesterStatus: (state) => (semester, status) => {
            if (semester === "Online") {
                return state.courses.filter(course => {
                    var curSemester = course.semester
                    if (course.chosenSemester && course.chosenSemester !== undefined) curSemester = course.chosenSemester;
                    return (course.status === status && state.semesterMapping[curSemester] === semester)
                })
            }
            if (semester === "Fall+Winter") {
                return state.courses.filter(course => {
                    var curSemester = course.semester
                    if (course.chosenSemester && course.chosenSemester !== undefined) curSemester = course.chosenSemester;
                    return (course.status === status && state.semesterMapping[curSemester] === semester)
                })
            } else {
                return state.courses.filter(course => {
                    var curSemester = course.chosenSemester ? course.chosenSemester : course.semester
                    if (curSemester in state.semesterMapping) {
                        curSemester = state.semesterMapping[curSemester]
                    }
                    else {
                        console.log("ERROR: Semester not found in mapping:" + curSemester)
                    }
                    return (course.status === status && curSemester.includes(semester) && !curSemester.includes('+'))
                })
            }

        },
        sumCompletedProperties: (state, getters) => (type, properties) => {
            const courses = getters.coursesCompleted
            var total = 0;
            var i, property;
            if (courses.length >= 1) {
                for (i in properties) {
                    property = properties[i];
                    if (type === undefined) {
                        total += courses
                            .map(course => Number(course[property]) || 0)
                            .reduce((total, credits) => total + credits);
                    } else {
                        total += courses
                            .map(course => Number(course[type][property]) || 0)
                            .reduce((total, credits) => total + credits);
                    }
                }
                return total;
            }
            return 0

        },
        sumInProgressProperties: (state, getters) => (type, properties) => {
            const courses = getters.coursesInProgress
            var total = 0;
            var i, property;
            if (courses.length >= 1) {
                for (i in properties) {
                    property = properties[i];
                    if (type === undefined) {
                        total += courses
                            .map(course => Number(course[property]) || 0)
                            .reduce((total, credits) => total + credits);
                    } else {
                        total += courses
                            .map(course => Number(course[type][property]) || 0)
                            .reduce((total, credits) => total + credits);
                    }
                }
                return total;
            }
            return 0
        },
        sumSavedProperties: (state, getters) => (type, properties) => {
            const courses = getters.coursesSaved
            var total = 0;
            var i, property;
            if (courses.length >= 1) {
                for (i in properties) {
                    property = properties[i];
                    if (type === undefined) {
                        total += courses
                            .map(course => Number(course[property]) || 0)
                            .reduce((total, credits) => total + credits);
                    } else {
                        total += courses
                            .map(course => Number(course[type][property]) || 0)
                            .reduce((total, credits) => total + credits);
                    }
                }
                return total;
            }
            return 0
        },
        labelsExceeded: (state, getters) => {
            const maxCounts = state.maxLabelCounts

            var result = []
            for (var rule of maxCounts) {
                rule.count = 0
            }

            // Total counts of all labels for courses taken or potentially taken
            for (const course of getters.coursesPlanned) {
                for (rule of maxCounts) {
                    rule.count += course.labels[rule.label]
                }
            }
            // Determine which labels are over the limit
            for (rule of maxCounts) {
                if (rule.count > rule.value) {
                    result.push([rule.label, rule.value, rule.count - rule.value])
                }
            }
            return result
        }
    },
    mutations: {
        addCourse(state, course) {
            state.courses.push(course)
        },
        updateServerUrls(state, url) {
            state.apiUrl = url + "/api"
            state.authUrl = url + "/authenticate"
            state.baseUrl = url
        },
        updateCourses(state, courses) {
            state.courses = courses
        },
        updateSeenGuide(state, value) {
            state.seenGuide = value
        },
        updateGraduationRequirements(state, graduationRequirements) {
            state.graduationRequirements = graduationRequirements
        },
        updateCsrfToken(state, token) {
            state.csrfToken = token
        },
        updateGlobalError(state, value) {
            state.globalError = value
        },
        updateGlobalErrorMessage(state, value) {
            state.globalErrorMessage = value
        },
        updateFirstLogin(state, value) {
            state.firstLogin = value
        },
        displayGlobalError(state, msg) {
            state.globalError = true
            state.globalErrorMessage = msg
        },
        updateRemovedCourse(state, payload) {
            state.recentlyRemovedCourse = payload[0]
            state.recentlyRemovedCourseStatus = payload[1]
        },
        updateUserDiscipline(state, value) {
            state.userDiscipline = value
        },
        updateUserStartYear(state, value) {
            state.userStartYear = value
        },
        updateRemovedSnackbarHome(state, value) {
            state.showRemovedSnackbarHome = value
        },
        updateRemovedSnackbarProgress(state, value) {
            state.showRemovedSnackbarProgress = value
        },
        updateProgressSidebar(state, value) {
            state.showProgressSidebar = value
        },
        updateRecentSidebar(state, value) {
            state.showRecentSidebar = value
        },
        addRecentlyViewed(state, toAdd) {
            var existingIndex = state.recentlyViewedCourses.indexOf(toAdd)
            if (existingIndex != -1) {
                state.recentlyViewedCourses.splice(existingIndex, 1)
            }
            state.recentlyViewedCourses.unshift(toAdd)
        },
        toggleAuthenticated(state) {
            state.authenticated = !state.authenticated
        },
        setUserInfo(state, payload) {
            state.firstName = payload.firstName
            state.lastName = payload.lastName
            state.userEmail = payload.email
            state.userDiscipline = payload.discipline
            state.userStartYear = payload.startYear
        },
        removeUserData(state) {
            state.firstName = ""
            state.lastName = ""
            state.userEmail = ""
            state.userDiscipline = ""
            state.userStartYear = ""
            state.courses = []
            state.graduationRequirements = []
            state.firstLogin = false
        }
    },
    actions: {
        undoRecentRemoval(context) {
            context.dispatch('updateCourseStatus', [context.state.recentlyRemovedCourse, context.state.recentlyRemovedCourseStatus])
        },
        updateCourseStatus: async function (context, payload) {
            const course = payload[0]
            let courseStatus = payload[1]

            var semester = course.chosenSemester ? course.chosenSemester : course.semester

            // Handle cases without a semester (mostly internship courses)
            if (semester === '') {
                semester = "OL"
            }

            // For courses that are preloaded upon first login
            if (semester.includes('/')) {
                semester = semester.split('/')[0]
                course.chosenSemester = semester
            }

            //TODO Update URL to include chosen section (instead of always 1)
            // eslint-disable-next-line no-unused-vars
            var requestUrl
            if (courseStatus === '' && (!course.chosenSemester || course.chosenSemester === course.semester)) { //Setting status to '' is considered removing the course, unless there is chosen semester data
                requestUrl = context.state.apiUrl.concat('/courses/user/remove/', course.prefix, '/', course.code, '/', course.year, '/1/')
            } else {
                if (courseStatus === '') courseStatus = 'clear'
                requestUrl = context.state.apiUrl.concat('/courses/user/set/', course.prefix, '/', course.code, '/', course.year, '/1/', semester, '/', courseStatus)
            }


            course.status = courseStatus

            // try {
            //     let response = await axios.post(requestUrl, {}, { withCredentials: true })

            //     if (response.status === 200) {
            //         course.status = courseStatus
            //     }
            //     else {
            //         console.log(response)
            //         context.commit('displayGlobalError', "Connection Error: Can't update.")
            //     }
            // }
            // catch (e) {
            //     console.log(e)
            //     context.commit('displayGlobalError', "Connection Error: Can't update.")

            // }
        },
        toggleStatus(context, payload) {
            const course = payload[0]
            const status = payload[1]

            var nextStatus
            if (course.status === status) {
                nextStatus = ''
            } else {
                nextStatus = status
            }

            context.dispatch('updateCourseStatus', [course, nextStatus])
        },
        updateCourseChosenSemester(context, payload) {
            const course = payload[0]
            const chosenSemester = payload[1]

            course.chosenSemester = chosenSemester
            context.dispatch('updateCourseStatus', [course, course.status])

        },
        checkSession: async function (context) {
            try {
                let response = await axios.get(context.state.apiUrl + "/user", { withCredentials: true })
                if (response.data.isSuccess) {
                    console.log(window.location.href)
                    context.dispatch("startApp", response.data.returned)
                }
            }
            catch (e) {
                console.log("No existing session: " + String(e))
            }
        },
        startApp(context, userInfo) {
            context.commit("toggleAuthenticated");
            context.commit("setUserInfo", userInfo);

            //Return to old page upon refresh
            const curUrl = window.location.href
            let curPage = curUrl.substring(curUrl.lastIndexOf('/'))
            if (curPage.includes("login") || curPage.includes("createAccount"))
                curPage = "/"

            router.push({ path: curPage });

            context.dispatch("fetchCourses")
            context.dispatch("fetchGraduationRequirements", userInfo.discipline)
        },
        loadCoreCourses: async function (context, startYear) {
            const date = new Date()
            const curYear = date.getFullYear()
            const curMonth = date.getMonth()
            // Student year = 1st year, 2nd year...
            let studentYear = curYear - startYear + (curMonth > 2 ? 1 : 0) // If april on onwards, count as planning for the next year

            if (studentYear < 1) studentYear = 1
            if (studentYear > 5) studentYear = 5

            const yearLocation = {
                1: {
                    "completed": [],
                    "inProgress": ["100"],
                    "saved": ["200", "300", "400"]
                },
                2: {
                    "completed": ["100"],
                    "inProgress": ["200"],
                    "saved": ["300", "400"]
                },
                3: {
                    "completed": ["100, 200"],
                    "inProgress": ["300"],
                    "saved": ["400"]
                },
                4: {
                    "completed": ["100", "200", "300"],
                    "inProgress": ["400"],
                    "saved": []
                },
                5: {
                    "completed": ["100", "200", "300", "400"],
                    "inProgress": [],
                    "saved": []
                },
            }

            
            const courseCodes = compCoreCourses
            //Add to completed
            for (const level of yearLocation[studentYear]["completed"]) {
                for (const code of courseCodes[level]) {
                    const course = context.getters.findCourseByCode(code)
                    context.dispatch("updateCourseStatus", [course, "completed"])
                }
            }

            //Add to inProgress
            for (const level of yearLocation[studentYear]["inProgress"]) {
                for (const code of courseCodes[level]) {
                    const course = context.getters.findCourseByCode(code)
                    context.dispatch("updateCourseStatus", [course, "inProgress"])
                }
            }

            //Add to saved
            for (const level of yearLocation[studentYear]["saved"]) {
                for (const code of courseCodes[level]) {
                    const course = context.getters.findCourseByCode(code)
                    context.dispatch("updateCourseStatus", [course, "saved"])
                }
            }



            // try {
            //     let response = await axios.get(context.state.apiUrl + '/courses/user/core/', { withCredentials: true })
            //     if (response.data.isSuccess) {
            //         const courseCodes = response.data.returned
            //         //Add to completed
            //         for (const level of yearLocation[studentYear]["completed"]) {
            //             for (const code of courseCodes[level]) {
            //                 const course = context.getters.findCourseByCode(code)
            //                 context.dispatch("updateCourseStatus", [course, "completed"])
            //             }
            //         }

            //         //Add to inProgress
            //         for (const level of yearLocation[studentYear]["inProgress"]) {
            //             for (const code of courseCodes[level]) {
            //                 const course = context.getters.findCourseByCode(code)
            //                 context.dispatch("updateCourseStatus", [course, "inProgress"])
            //             }
            //         }

            //         //Add to saved
            //         for (const level of yearLocation[studentYear]["saved"]) {
            //             for (const code of courseCodes[level]) {
            //                 const course = context.getters.findCourseByCode(code)
            //                 context.dispatch("updateCourseStatus", [course, "saved"])
            //             }
            //         }
            //     }
            //     else {
            //         console.log(response)
            //         context.commit('displayGlobalError', "Connection Error: Can't preload core courses.")
            //     }
            // }
            // catch (e) {
            //     console.log(e)
            //     context.commit('displayGlobalError', "Connection Error: Can't preload core courses.")
            // }
        },
        fetchCourses: async function (context) {
            context.commit('updateCourses', courseData)
            context.dispatch("loadCoreCourses", context.state.userStartYear)

            // try {
            //     let response = await axios.get(context.state.apiUrl + '/courses/', { withCredentials: true })
            //     if (response.status === 200) {
            //         context.commit('updateCourses', response.data.returned)

            //     //If first time loading courses, also set the core courses status
            //     if (context.state.firstLogin) {
            //         context.dispatch("loadCoreCourses", context.state.userStartYear)
            //     }

            //     }
            //     else {
            //         console.log(response)
            //         context.commit('displayGlobalError', "Connection Error: Can't load courses.")
            //     }
            // }
            // catch (e) {
            //     console.log(e)
            //     context.commit('displayGlobalError', "Connection Error: Can't load courses.")
            // }
        },
        
        // eslint-disable-next-line no-unused-vars
        fetchGraduationRequirements: async function (context, discipline) {
            context.commit("updateGraduationRequirements", compGradRequirements)

            // try{
            //     let response = await axios.get(context.state.apiUrl + "/grad_requirements/engineering/" + discipline, { withCredentials: true })
            //     if (response.data.isSuccess){
            //         context.commit("updateGraduationRequirements", response.data.returned)
            //     }
            //     else{
            //         console.log(response)
            //         context.commit('displayGlobalError', "Connection Error: Can't load grad requirements.")    
            //     }
            // }
            // catch(e){
            //     console.log(e)
            //     context.commit('displayGlobalError', "Connection Error: Can't load grad requirements.")
            // }
        },
        reloadDesciplineInfo: async function (context) {
            console.log(context.state.discipline)
            console.log(context.state.startYear)
            // Credit requirements?
            //label names
            //graduation requirements
            //maxlabelcounts
            //disciplineContact
        },
        stopApp(context) {
            context.commit('toggleAuthenticated')
            context.commit('removeUserData')
            router.push("/login")
        }
    },
})
