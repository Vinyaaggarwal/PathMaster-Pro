cmake_minimum_required(VERSION 3.10)
project(RoutingEngine)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2 -Wall -Wextra")

file(GLOB SRC_FILES src/*.cpp)
add_executable(routing ${SRC_FILES})

target_include_directories(routing PRIVATE include)
